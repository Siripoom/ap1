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
  case 'calculateAvgScore':
   echo json_encode(calculateAverageScore($config, $input['paperNo']), JSON_UNESCAPED_UNICODE);
   break;
  case 'updatePaperStatus':
   echo json_encode(updatePaperStatusAuto($config, $input['paperNo']), JSON_UNESCAPED_UNICODE);
   break;
  case 'getEvaluationSummary':
   echo json_encode(getEvaluationSummary($config, $input['paperNo']), JSON_UNESCAPED_UNICODE);
   break;
  case 'getPapersByStatus':
   echo json_encode(getPapersByStatus($config, $input['status']), JSON_UNESCAPED_UNICODE);
   break;
 }
}

/**
 * คำนวณคะแนนเฉลี่ยจากผู้ประเมินทั้งหมด
 */
function calculateAverageScore($config, $paperNo)
{
 try {
  // ดึงข้อมูลคะแนนจากตาราง paper_evaluator และ paper_evaluator2
  $sql = "SELECT 
                    (COALESCE(pe1.at01,0) + COALESCE(pe1.at02,0) + COALESCE(pe1.at03,0) + 
                     COALESCE(pe1.at04,0) + COALESCE(pe1.at05,0) + COALESCE(pe1.at06,0) + 
                     COALESCE(pe1.at07,0) + COALESCE(pe1.at08,0) + COALESCE(pe1.at09,0) + 
                     COALESCE(pe1.at10,0)) * 2 as score1,
                    (COALESCE(pe2.at01,0) + COALESCE(pe2.at02,0) + COALESCE(pe2.at03,0) + 
                     COALESCE(pe2.at04,0) + COALESCE(pe2.at05,0) + COALESCE(pe2.at06,0) + 
                     COALESCE(pe2.at07,0) + COALESCE(pe2.at08,0) + COALESCE(pe2.at09,0) + 
                     COALESCE(pe2.at10,0)) * 2 as score2,
                    pe1.status as status1,
                    pe2.status as status2,
                    p.score as current_score,
                    p.scoreMax as max_score,
                    p.status as paper_status
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

  $evaluationCount = 0;
  $totalScore = 0;
  $evaluationDetails = [];

  // นับจำนวนการประเมินและรวมคะแนน
  if ($result['score1'] > 0) {
   $evaluationCount++;
   $totalScore += $result['score1'];
   $evaluationDetails[] = [
    'round' => 1,
    'score' => $result['score1'],
    'status' => $result['status1']
   ];
  }

  if ($result['score2'] > 0) {
   $evaluationCount++;
   $totalScore += $result['score2'];
   $evaluationDetails[] = [
    'round' => 2,
    'score' => $result['score2'],
    'status' => $result['status2']
   ];
  }

  $averageScore = $evaluationCount > 0 ? $totalScore / $evaluationCount : 0;
  $maxPossibleScore = $result['max_score'] ? $result['max_score'] : 100;
  $percentage = $maxPossibleScore > 0 ? ($averageScore / $maxPossibleScore) * 100 : 0;

  return [
   'paperNo' => $paperNo,
   'evaluationCount' => $evaluationCount,
   'averageScore' => round($averageScore, 2),
   'percentage' => round($percentage, 2),
   'maxScore' => $maxPossibleScore,
   'currentStatus' => $result['paper_status'],
   'evaluationDetails' => $evaluationDetails,
   'recommendation' => getScoreRecommendation($percentage)
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * กำหนดคำแนะนำตามคะแนนเปอร์เซ็นต์
 */
function getScoreRecommendation($percentage)
{
 if ($percentage >= 80) {
  return [
   'level' => 'very_good',
   'text' => 'Very Good Paper - แนะนำให้ตอบรับ',
   'status' => 1
  ];
 } elseif ($percentage >= 70) {
  return [
   'level' => 'good',
   'text' => 'Good Paper - ตอบรับแบบแก้ไขเล็กน้อย',
   'status' => 2
  ];
 } elseif ($percentage >= 60) {
  return [
   'level' => 'acceptable',
   'text' => 'Acceptable - ตอบรับแบบแก้ไขมาก',
   'status' => 3
  ];
 } else {
  return [
   'level' => 'rejected',
   'text' => 'Below Standard - ไม่ตอบรับ',
   'status' => 4
  ];
 }
}

/**
 * อัปเดตสถานะบทความอัตโนมัติ
 */
function updatePaperStatusAuto($config, $paperNo)
{
 try {
  // คำนวณคะแนนเฉลี่ย
  $scoreData = calculateAverageScore($config, $paperNo);

  if (isset($scoreData['error'])) {
   return $scoreData;
  }

  // ตรวจสอบว่าประเมินครบหรือยัง (ต้องมีการประเมินอย่างน้อย 1 รอบ)
  if ($scoreData['evaluationCount'] == 0) {
   return ['error' => 'No evaluation found'];
  }

  $recommendation = $scoreData['recommendation'];
  $newStatus = $recommendation['status'];
  $averageScore = $scoreData['averageScore'];

  // อัปเดตสถานะในฐานข้อมูล
  $sql = "UPDATE paper 
                SET status = :status, 
                    score = :score, 
                    dateE = NOW(),
                    evaluationComplete = 1
                WHERE no = :paperNo";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute([
   'status' => $newStatus,
   'score' => $averageScore,
   'paperNo' => $paperNo
  ]);

  // บันทึกประวัติการอัปเดตสถานะ
  $logSql = "INSERT INTO paper_status_log (paperNo, oldStatus, newStatus, averageScore, updateDate, reason) 
                   VALUES (:paperNo, :oldStatus, :newStatus, :averageScore, NOW(), :reason)";

  $logStmt = $config->CON->prepare($logSql);
  $logStmt->execute([
   'paperNo' => $paperNo,
   'oldStatus' => $scoreData['currentStatus'],
   'newStatus' => $newStatus,
   'averageScore' => $averageScore,
   'reason' => 'Auto update based on evaluation score: ' . $recommendation['text']
  ]);

  return [
   'success' => true,
   'paperNo' => $paperNo,
   'oldStatus' => $scoreData['currentStatus'],
   'newStatus' => $newStatus,
   'averageScore' => $averageScore,
   'percentage' => $scoreData['percentage'],
   'recommendation' => $recommendation,
   'message' => 'Paper status updated successfully'
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ดึงสรุปการประเมิน
 */
function getEvaluationSummary($config, $paperNo)
{
 try {
  $sql = "SELECT 
                    p.no,
                    p.titleNews,
                    p.typesNews,
                    p.name as authorName,
                    p.email as authorEmail,
                    p.status,
                    p.score,
                    p.scoreMax,
                    p.dateE,
                    pe1.note as note1,
                    pe1.file as file1,
                    pe1.status as eval1_status,
                    pe2.note as note2,
                    pe2.file as file2,
                    pe2.status as eval2_status,
                    COUNT(ne.no) as evaluator_count
                FROM paper p
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                LEFT JOIN news_evaluator ne ON p.no = ne.noPaper
                WHERE p.no = :paperNo
                GROUP BY p.no";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$result) {
   return ['error' => 'Paper not found'];
  }

  // คำนวณคะแนนเฉลี่ย
  $scoreData = calculateAverageScore($config, $paperNo);

  $result['scoreAnalysis'] = $scoreData;

  return $result;
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ดึงรายการบทความตามสถานะ
 */
function getPapersByStatus($config, $status = null)
{
 try {
  $sql = "SELECT 
                    p.no,
                    p.titleNews,
                    p.name as authorName,
                    p.score,
                    p.status,
                    p.dateE,
                    COUNT(pe1.no) + COUNT(pe2.no) as evaluation_count
                FROM paper p
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no";

  if ($status !== null) {
   $sql .= " WHERE p.status = :status";
  }

  $sql .= " GROUP BY p.no ORDER BY p.dateE DESC";

  $stmt = $config->CON->prepare($sql);

  if ($status !== null) {
   $stmt->execute(['status' => $status]);
  } else {
   $stmt->execute();
  }

  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // เพิ่มข้อมูลคำแนะนำสำหรับแต่ละบทความ
  foreach ($results as &$paper) {
   if ($paper['score'] > 0) {
    $percentage = ($paper['score'] / 100) * 100; // สมมติว่าคะแนนเต็ม 100
    $paper['recommendation'] = getScoreRecommendation($percentage);
   }
  }

  return $results;
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}
