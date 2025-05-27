<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, x-requested-with');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
 require('../config.php');
 $config = new config();
 $content = file_get_contents('php://input');
 $input = json_decode($content, true);
 $header = $input['header'];

 switch ($header) {
  case 'processAll':
   echo json_encode(processAllPaperScores($config), JSON_UNESCAPED_UNICODE);
   break;
  case 'processSpecific':
   echo json_encode(processSpecificPapers($config, $input['paperNos']), JSON_UNESCAPED_UNICODE);
   break;
  case 'getProcessingStatus':
   echo json_encode(getProcessingStatus($config), JSON_UNESCAPED_UNICODE);
   break;
 }
}

/**
 * ประมวลผลคะแนนของบทความทั้งหมดที่มีการประเมิน
 */
function processAllPaperScores($config)
{
 $processedCount = 0;
 $errorCount = 0;
 $results = [];

 try {
  // ดึงรายการบทความที่มีการประเมินแล้วแต่ยังไม่ได้ประมวลผล
  $sql = "SELECT DISTINCT p.no, p.titleNews, p.status as currentStatus
                FROM paper p
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                WHERE (pe1.no IS NOT NULL OR pe2.no IS NOT NULL)
                AND p.evaluationComplete = 0
                ORDER BY p.no";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute();
  $papers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($papers as $paper) {
   try {
    $result = processSinglePaper($config, $paper['no']);

    if (isset($result['success']) && $result['success']) {
     $processedCount++;
     $results[] = [
      'paperNo' => $paper['no'],
      'title' => $paper['titleNews'],
      'oldStatus' => $paper['currentStatus'],
      'newStatus' => $result['newStatus'],
      'averageScore' => $result['averageScore'],
      'status' => 'success'
     ];
    } else {
     $errorCount++;
     $results[] = [
      'paperNo' => $paper['no'],
      'title' => $paper['titleNews'],
      'error' => $result['error'] ?? 'Unknown error',
      'status' => 'error'
     ];
    }
   } catch (Exception $e) {
    $errorCount++;
    $results[] = [
     'paperNo' => $paper['no'],
     'title' => $paper['titleNews'],
     'error' => $e->getMessage(),
     'status' => 'error'
    ];
   }
  }

  // บันทึกผลการประมวลผลทั้งหมด
  $batchLogSql = "INSERT INTO batch_processing_log 
                        (processDate, totalPapers, processedCount, errorCount, results) 
                        VALUES (NOW(), :total, :processed, :errors, :results)";

  $batchStmt = $config->CON->prepare($batchLogSql);
  $batchStmt->execute([
   'total' => count($papers),
   'processed' => $processedCount,
   'errors' => $errorCount,
   'results' => json_encode($results)
  ]);

  return [
   'success' => true,
   'totalPapers' => count($papers),
   'processedCount' => $processedCount,
   'errorCount' => $errorCount,
   'results' => $results,
   'message' => "ประมวลผลเสร็จสิ้น: {$processedCount} สำเร็จ, {$errorCount} ผิดพลาด"
  ];
 } catch (PDOException $e) {
  return [
   'success' => false,
   'error' => $e->getMessage()
  ];
 }
}

/**
 * ประมวลผลบทความเฉพาะ
 */
function processSpecificPapers($config, $paperNos)
{
 $results = [];

 foreach ($paperNos as $paperNo) {
  $result = processSinglePaper($config, $paperNo);
  $results[] = [
   'paperNo' => $paperNo,
   'result' => $result
  ];
 }

 return [
  'success' => true,
  'results' => $results
 ];
}

/**
 * ประมวลผลบทความเดี่ยว
 */
function processSinglePaper($config, $paperNo)
{
 try {
  // คำนวณคะแนนเฉลี่ย
  $sql = "SELECT 
                    p.status as currentStatus,
                    (COALESCE(pe1.at01,0) + COALESCE(pe1.at02,0) + COALESCE(pe1.at03,0) + 
                     COALESCE(pe1.at04,0) + COALESCE(pe1.at05,0) + COALESCE(pe1.at06,0) + 
                     COALESCE(pe1.at07,0) + COALESCE(pe1.at08,0) + COALESCE(pe1.at09,0) + 
                     COALESCE(pe1.at10,0)) * 2 as score1,
                    (COALESCE(pe2.at01,0) + COALESCE(pe2.at02,0) + COALESCE(pe2.at03,0) + 
                     COALESCE(pe2.at04,0) + COALESCE(pe2.at05,0) + COALESCE(pe2.at06,0) + 
                     COALESCE(pe2.at07,0) + COALESCE(pe2.at08,0) + COALESCE(pe2.at09,0) + 
                     COALESCE(pe2.at10,0)) * 2 as score2,
                    pe1.status as eval1_status,
                    pe2.status as eval2_status
                FROM paper p
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                WHERE p.no = :paperNo";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$result) {
   return ['error' => 'Paper not found'];
  }

  // คำนวณคะแนนเฉลี่ย
  $evaluationCount = 0;
  $totalScore = 0;

  if ($result['score1'] > 0) {
   $evaluationCount++;
   $totalScore += $result['score1'];
  }

  if ($result['score2'] > 0) {
   $evaluationCount++;
   $totalScore += $result['score2'];
  }

  if ($evaluationCount == 0) {
   return ['error' => 'No evaluations found'];
  }

  $averageScore = $totalScore / $evaluationCount;
  $percentage = ($averageScore / 100) * 100;

  // กำหนดสถานะใหม่
  $newStatus = determineStatus($percentage);

  // อัปเดตฐานข้อมูล
  $updateSql = "UPDATE paper 
                      SET status = :status, 
                          score = :score, 
                          averageScore = :avgScore,
                          evaluationComplete = 1,
                          dateE = NOW(),
                          lastUpdated = NOW()
                      WHERE no = :paperNo";

  $updateStmt = $config->CON->prepare($updateSql);
  $updateStmt->execute([
   'status' => $newStatus,
   'score' => $averageScore,
   'avgScore' => $averageScore,
   'paperNo' => $paperNo
  ]);

  // บันทึกประวัติ
  $logSql = "INSERT INTO paper_status_log 
                   (paperNo, oldStatus, newStatus, averageScore, updateDate, reason, updatedBy) 
                   VALUES (:paperNo, :oldStatus, :newStatus, :averageScore, NOW(), :reason, 'system')";

  $logStmt = $config->CON->prepare($logSql);
  $logStmt->execute([
   'paperNo' => $paperNo,
   'oldStatus' => $result['currentStatus'],
   'newStatus' => $newStatus,
   'averageScore' => $averageScore,
   'reason' => "Batch processing - Score: {$percentage}%, Evaluations: {$evaluationCount}"
  ]);

  return [
   'success' => true,
   'paperNo' => $paperNo,
   'oldStatus' => $result['currentStatus'],
   'newStatus' => $newStatus,
   'averageScore' => $averageScore,
   'percentage' => $percentage,
   'evaluationCount' => $evaluationCount
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * กำหนดสถานะตามเปอร์เซ็นต์คะแนน
 */
function determineStatus($percentage)
{
 if ($percentage >= 80) {
  return 1; // ตอบรับแบบไม่แก้ไข
 } elseif ($percentage >= 70) {
  return 2; // ตอบรับแบบแก้ไขเล็กน้อย
 } elseif ($percentage >= 60) {
  return 3; // ตอบรับแบบแก้ไขมาก
 } else {
  return 4; // ไม่ตอบรับ
 }
}

/**
 * ดึงสถานะการประมวลผล
 */
function getProcessingStatus($config)
{
 try {
  // สถานะการประมวลผลล่าสุด
  $sql = "SELECT * FROM batch_processing_log ORDER BY processDate DESC LIMIT 1";
  $stmt = $config->CON->prepare($sql);
  $stmt->execute();
  $lastBatch = $stmt->fetch(PDO::FETCH_ASSOC);

  // จำนวนบทความที่รอประมวลผล
  $pendingSql = "SELECT COUNT(DISTINCT p.no) as pending_count
                       FROM paper p
                       LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                       LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                       WHERE (pe1.no IS NOT NULL OR pe2.no IS NOT NULL)
                       AND p.evaluationComplete = 0";

  $pendingStmt = $config->CON->prepare($pendingSql);
  $pendingStmt->execute();
  $pendingResult = $pendingStmt->fetch(PDO::FETCH_ASSOC);

  // สถิติทั่วไป
  $statsSql = "SELECT 
                         COUNT(*) as total_papers,
                         SUM(CASE WHEN evaluationComplete = 1 THEN 1 ELSE 0 END) as completed_papers,
                         SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as accepted_papers,
                         SUM(CASE WHEN status = 2 OR status = 3 THEN 1 ELSE 0 END) as revision_papers,
                         SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) as rejected_papers,
                         AVG(CASE WHEN averageScore > 0 THEN averageScore ELSE NULL END) as overall_average
                     FROM paper";

  $statsStmt = $config->CON->prepare($statsSql);
  $statsStmt->execute();
  $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

  return [
   'success' => true,
   'lastBatch' => $lastBatch,
   'pendingCount' => $pendingResult['pending_count'],
   'statistics' => $stats
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * สร้างรายงานสรุป
 */
function generateSummaryReport($config, $dateFrom = null, $dateTo = null)
{
 try {
  $whereClause = "";
  $params = [];

  if ($dateFrom && $dateTo) {
   $whereClause = "WHERE p.dateE BETWEEN :dateFrom AND :dateTo";
   $params = ['dateFrom' => $dateFrom, 'dateTo' => $dateTo];
  }

  $sql = "SELECT 
                    p.typesNews,
                    COUNT(*) as total_papers,
                    SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) as accepted,
                    SUM(CASE WHEN p.status = 2 THEN 1 ELSE 0 END) as minor_revision,
                    SUM(CASE WHEN p.status = 3 THEN 1 ELSE 0 END) as major_revision,
                    SUM(CASE WHEN p.status = 4 THEN 1 ELSE 0 END) as rejected,
                    AVG(CASE WHEN p.averageScore > 0 THEN p.averageScore ELSE NULL END) as avg_score,
                    MIN(CASE WHEN p.averageScore > 0 THEN p.averageScore ELSE NULL END) as min_score,
                    MAX(CASE WHEN p.averageScore > 0 THEN p.averageScore ELSE NULL END) as max_score
                FROM paper p
                {$whereClause}
                GROUP BY p.typesNews
                ORDER BY p.typesNews";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute($params);
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  return [
   'success' => true,
   'report' => $results,
   'period' => [
    'from' => $dateFrom,
    'to' => $dateTo
   ]
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}
