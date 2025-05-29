<?php
// public/backend/evaluator/individual-evaluation.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-requested-with');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 http_response_code(200);
 exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
 require('../config.php');
 $config = new config();
 $content = file_get_contents('php://input');
 $input = json_decode($content, true);
 $header = $input['header'];

 switch ($header) {
  case 'getMyPapersToEvaluate':
   echo json_encode(getMyPapersToEvaluate($config, $input['email']), JSON_UNESCAPED_UNICODE);
   break;
  case 'checkIndividualEvaluationStatus':
   echo json_encode(checkIndividualEvaluationStatus($config, $input['paperNo'], $input['email']), JSON_UNESCAPED_UNICODE);
   break;
  case 'submitIndividualEvaluation':
   echo json_encode(submitIndividualEvaluation($config, $input), JSON_UNESCAPED_UNICODE);
   break;
  case 'getMyEvaluationDetails':
   echo json_encode(getMyEvaluationDetails($config, $input['paperNo'], $input['email']), JSON_UNESCAPED_UNICODE);
   break;
 }
}

/**
 * ดึงรายการบทความที่ผู้ประเมินคนนี้ต้องประเมิน (เฉพาะตัวเอง)
 */
function getMyPapersToEvaluate($config, $email)
{
 try {
  $sql = "SELECT DISTINCT
                    p.no as paperNo,
                    p.titleNews,
                    p.typesNews,
                    p.name as authorName,
                    p.email as authorEmail,
                    p.file,
                    p.date,
                    p.status as paperStatus,
                    ne.no as assignmentNo,
                    ne.date as assignedDate,
                    -- ตรวจสอบการประเมินของผู้ประเมินคนนี้เท่านั้น
                    (SELECT COUNT(*) FROM individual_evaluations ie 
                     WHERE ie.paperNo = p.no AND ie.evaluatorEmail = :email) as myEvaluationCount,
                    -- ดึงการประเมินล่าสุดของผู้ประเมินคนนี้
                    (SELECT ie.status FROM individual_evaluations ie 
                     WHERE ie.paperNo = p.no AND ie.evaluatorEmail = :email 
                     ORDER BY ie.evaluationDate DESC LIMIT 1) as myLastEvaluationStatus,
                    (SELECT ie.evaluationDate FROM individual_evaluations ie 
                     WHERE ie.paperNo = p.no AND ie.evaluatorEmail = :email 
                     ORDER BY ie.evaluationDate DESC LIMIT 1) as myLastEvaluationDate
                FROM news_evaluator ne
                INNER JOIN paper p ON ne.noPaper = p.no
                WHERE ne.email = :email
                AND p.status IN (0, 2, 3) -- เฉพาะบทความที่ยังต้องประเมิน
                ORDER BY ne.date DESC";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['email' => $email]);
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // เพิ่มข้อมูลสถานะการประเมินสำหรับแต่ละบทความ
  foreach ($results as &$paper) {
   $paper['canEvaluate'] = $paper['myEvaluationCount'] == 0; // สามารถประเมินได้ถ้ายังไม่เคยประเมิน
   $paper['evaluationStatus'] = $paper['myEvaluationCount'] > 0 ? 'completed' : 'pending';

   // ถ้าเคยประเมินแล้ว ให้แสดงข้อมูลการประเมิน
   if ($paper['myEvaluationCount'] > 0) {
    $paper['myEvaluationStatusText'] = getStatusText($paper['myLastEvaluationStatus']);
   }
  }

  return [
   'success' => true,
   'papers' => $results,
   'totalPapers' => count($results),
   'pendingCount' => count(array_filter($results, function ($p) {
    return $p['canEvaluate'];
   })),
   'completedCount' => count(array_filter($results, function ($p) {
    return !$p['canEvaluate'];
   }))
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ตรวจสอบสถานะการประเมินของผู้ประเมินคนนี้เฉพาะ
 */
function checkIndividualEvaluationStatus($config, $paperNo, $email)
{
 try {
  // ตรวจสอบว่าเป็นผู้ประเมินที่ได้รับมอบหมายหรือไม่
  $checkAssignmentSql = "SELECT COUNT(*) as count FROM news_evaluator 
                              WHERE noPaper = :paperNo AND email = :email";
  $checkStmt = $config->CON->prepare($checkAssignmentSql);
  $checkStmt->execute(['paperNo' => $paperNo, 'email' => $email]);
  $assignmentCheck = $checkStmt->fetch(PDO::FETCH_ASSOC);

  if ($assignmentCheck['count'] == 0) {
   return ['error' => 'คุณไม่ได้รับมอบหมายให้ประเมินบทความนี้'];
  }

  // ตรวจสอบการประเมินของผู้ประเมินคนนี้เท่านั้น
  $sql = "SELECT 
                    COUNT(*) as evaluationCount,
                    MAX(evaluationDate) as lastEvaluationDate,
                    (SELECT status FROM individual_evaluations 
                     WHERE paperNo = :paperNo AND evaluatorEmail = :email 
                     ORDER BY evaluationDate DESC LIMIT 1) as lastStatus
                FROM individual_evaluations 
                WHERE paperNo = :paperNo AND evaluatorEmail = :email";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo, 'email' => $email]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  $canEvaluate = $result['evaluationCount'] == 0;

  return [
   'success' => true,
   'canEvaluate' => $canEvaluate,
   'hasEvaluated' => $result['evaluationCount'] > 0,
   'evaluationCount' => $result['evaluationCount'],
   'lastEvaluationDate' => $result['lastEvaluationDate'],
   'lastStatus' => $result['lastStatus'],
   'message' => $canEvaluate ? 'สามารถประเมินได้' : 'คุณได้ประเมินบทความนี้แล้ว'
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * บันทึกการประเมินของผู้ประเมินแต่ละคน
 */
function submitIndividualEvaluation($config, $data)
{
 try {
  $paperNo = $data['paperNo'];
  $evaluatorEmail = $data['evaluatorEmail'];
  $scores = $data['scores']; // array ของคะแนน [at01, at02, ...]
  $status = $data['status']; // 1=ตอบรับ, 2=แก้ไขเล็กน้อย, 3=แก้ไขมาก, 4=ไม่ตอบรับ
  $note = $data['note'] ?? '';
  $file = $data['file'] ?? '';

  // ตรวจสอบว่าประเมินแล้วหรือยัง
  $checkSql = "SELECT COUNT(*) as count FROM individual_evaluations 
                     WHERE paperNo = :paperNo AND evaluatorEmail = :evaluatorEmail";
  $checkStmt = $config->CON->prepare($checkSql);
  $checkStmt->execute(['paperNo' => $paperNo, 'evaluatorEmail' => $evaluatorEmail]);
  $checkResult = $checkStmt->fetch(PDO::FETCH_ASSOC);

  if ($checkResult['count'] > 0) {
   return ['error' => 'คุณได้ประเมินบทความนี้แล้ว'];
  }

  // ดึงข้อมูลผู้ประเมิน
  $userSql = "SELECT title, fname, lname FROM user WHERE email = :email";
  $userStmt = $config->CON->prepare($userSql);
  $userStmt->execute(['email' => $evaluatorEmail]);
  $evaluator = $userStmt->fetch(PDO::FETCH_ASSOC);

  $evaluatorName = $evaluator['title'] . $evaluator['fname'] . ' ' . $evaluator['lname'];

  // คำนวณคะแนนรวม
  $totalScore = array_sum($scores) * 2;

  // บันทึกการประเมิน
  $sql = "INSERT INTO individual_evaluations (
                    paperNo, evaluatorEmail, evaluatorName,
                    at01, at02, at03, at04, at05, 
                    at06, at07, at08, at09, at10,
                    totalScore, status, note, file, evaluationDate
                ) VALUES (
                    :paperNo, :evaluatorEmail, :evaluatorName,
                    :at01, :at02, :at03, :at04, :at05,
                    :at06, :at07, :at08, :at09, :at10,
                    :totalScore, :status, :note, :file, NOW()
                )";

  $stmt = $config->CON->prepare($sql);
  $params = [
   'paperNo' => $paperNo,
   'evaluatorEmail' => $evaluatorEmail,
   'evaluatorName' => $evaluatorName,
   'totalScore' => $totalScore,
   'status' => $status,
   'note' => $note,
   'file' => $file
  ];

  // เพิ่มคะแนนแต่ละข้อ
  for ($i = 1; $i <= 10; $i++) {
   $key = 'at' . sprintf('%02d', $i);
   $params[$key] = $scores[$i - 1] ?? 0;
  }

  $stmt->execute($params);

  // ตรวจสอบและอัปเดตสถานะของบทความ
  updatePaperStatusAfterEvaluation($config, $paperNo);

  return [
   'success' => true,
   'message' => 'บันทึกการประเมินเรียบร้อยแล้ว',
   'totalScore' => $totalScore,
   'evaluationId' => $config->CON->lastInsertId()
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ดึงรายละเอียดการประเมินของผู้ประเมินคนนี้
 */
function getMyEvaluationDetails($config, $paperNo, $email)
{
 try {
  $sql = "SELECT * FROM individual_evaluations 
                WHERE paperNo = :paperNo AND evaluatorEmail = :email 
                ORDER BY evaluationDate DESC LIMIT 1";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo, 'email' => $email]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$result) {
   return ['error' => 'ไม่พบการประเมินของคุณสำหรับบทความนี้'];
  }

  return [
   'success' => true,
   'evaluation' => $result
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * อัปเดตสถานะของบทความหลังจากมีการประเมิน
 */
function updatePaperStatusAfterEvaluation($config, $paperNo)
{
 try {
  // นับจำนวนผู้ประเมินที่ได้รับมอบหมาย
  $assignedSql = "SELECT COUNT(*) as assignedCount FROM news_evaluator WHERE noPaper = :paperNo";
  $assignedStmt = $config->CON->prepare($assignedSql);
  $assignedStmt->execute(['paperNo' => $paperNo]);
  $assignedResult = $assignedStmt->fetch(PDO::FETCH_ASSOC);
  $assignedCount = $assignedResult['assignedCount'];

  // นับจำนวนผู้ประเมินที่ประเมินแล้ว
  $evaluatedSql = "SELECT COUNT(*) as evaluatedCount FROM individual_evaluations WHERE paperNo = :paperNo";
  $evaluatedStmt = $config->CON->prepare($evaluatedSql);
  $evaluatedStmt->execute(['paperNo' => $paperNo]);
  $evaluatedResult = $evaluatedStmt->fetch(PDO::FETCH_ASSOC);
  $evaluatedCount = $evaluatedResult['evaluatedCount'];

  // ถ้าประเมินครb/ทุกคนแล้ว ให้คำนวณคะแนนเฉลี่ยและอัปเดตสถานะ
  if ($evaluatedCount >= $assignedCount) {
   // คำนวณคะแนนเฉลี่ย
   $avgSql = "SELECT 
                        AVG(totalScore) as averageScore,
                        COUNT(*) as totalEvaluations,
                        GROUP_CONCAT(status) as allStatuses
                       FROM individual_evaluations 
                       WHERE paperNo = :paperNo";

   $avgStmt = $config->CON->prepare($avgSql);
   $avgStmt->execute(['paperNo' => $paperNo]);
   $avgResult = $avgStmt->fetch(PDO::FETCH_ASSOC);

   $averageScore = $avgResult['averageScore'];
   $percentage = ($averageScore / 100) * 100;

   // กำหนดสถานะตามคะแนนเฉลี่ย
   $finalStatus = 1; // default: ตอบรับ
   if ($percentage >= 80) {
    $finalStatus = 1; // ตอบรับแบบไม่แก้ไข
   } elseif ($percentage >= 70) {
    $finalStatus = 2; // แก้ไขเล็กน้อย
   } elseif ($percentage >= 60) {
    $finalStatus = 3; // แก้ไขมาก
   } else {
    $finalStatus = 4; // ไม่ตอบรับ
   }

   // อัปเดตสถานะของบทความ
   $updateSql = "UPDATE paper SET 
                         status = :status,
                         score = :averageScore,
                         scoreMax = 100,
                         dateE = NOW(),
                         evaluationComplete = 1
                         WHERE no = :paperNo";

   $updateStmt = $config->CON->prepare($updateSql);
   $updateStmt->execute([
    'status' => $finalStatus,
    'averageScore' => $averageScore,
    'paperNo' => $paperNo
   ]);

   // บันทึกประวัติการอัปเดตสถานะ
   $logSql = "INSERT INTO paper_evaluation_log (
                       paperNo, averageScore, finalStatus, 
                       totalEvaluators, completedDate
                       ) VALUES (
                       :paperNo, :averageScore, :finalStatus,
                       :totalEvaluators, NOW()
                       )";

   $logStmt = $config->CON->prepare($logSql);
   $logStmt->execute([
    'paperNo' => $paperNo,
    'averageScore' => $averageScore,
    'finalStatus' => $finalStatus,
    'totalEvaluators' => $evaluatedCount
   ]);
  }
 } catch (PDOException $e) {
  error_log("Error updating paper status: " . $e->getMessage());
 }
}

/**
 * แปลงสถานะเป็นข้อความ
 */
function getStatusText($status)
{
 switch ($status) {
  case 1:
   return 'ตอบรับแบบไม่แก้ไข';
  case 2:
   return 'ตอบรับแบบแก้ไขเล็กน้อย';
  case 3:
   return 'ตอบรับแบบแก้ไขมาก';
  case 4:
   return 'ไม่ตอบรับ';
  default:
   return 'ไม่ระบุ';
 }
}
