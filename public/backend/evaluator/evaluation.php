<?php
// public/backend/evaluator/evaluation.php
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
  case 'getPaperForEvaluation':
   echo json_encode(getPaperForEvaluation($config, $input['paperNo']), JSON_UNESCAPED_UNICODE);
   break;
  case 'getEvaluationQuestions':
   echo json_encode(getEvaluationQuestions($config, $input['newsNo']), JSON_UNESCAPED_UNICODE);
   break;
  case 'submitEvaluation':
   echo json_encode(submitEvaluation($config, $input), JSON_UNESCAPED_UNICODE);
   break;
  case 'getMyEvaluations':
   echo json_encode(getMyEvaluations($config, $input['email']), JSON_UNESCAPED_UNICODE);
   break;
  case 'checkEvaluationExists':
   echo json_encode(checkEvaluationExists($config, $input['paperNo'], $input['email']), JSON_UNESCAPED_UNICODE);
   break;
 }
}

/**
 * ดึงข้อมูลบทความสำหรับการประเมิน
 */
function getPaperForEvaluation($config, $paperNo)
{
 try {
  $sql = "SELECT 
                    p.*,
                    n.title as newsTitle,
                    n.text as newsDescription,
                    u.title as authorTitle,
                    u.fname as authorFname,
                    u.lname as authorLname
                FROM paper p
                LEFT JOIN news n ON p.noNews = n.no
                LEFT JOIN user u ON p.email = u.email
                WHERE p.no = :paperNo";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$result) {
   return ['error' => 'Paper not found'];
  }

  return [
   'success' => true,
   'paper' => $result
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ดึงคำถามสำหรับการประเมิน
 */
function getEvaluationQuestions($config, $newsNo)
{
 try {
  $sql = "SELECT * FROM paper_question WHERE newsNo = :newsNo";
  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['newsNo' => $newsNo]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$result) {
   // ถ้าไม่มีคำถามเฉพาะ ใช้คำถามมาตรฐาน
   $defaultQuestions = [
    'question01' => 'เป็นผลงานที่มีการกำหนดประเด็นที่ต้องการอธิบายหรือวิเคราะห์อย่างชัดเจน',
    'question02' => 'เป็นผลงานที่มีเนื้อหาสาระถูกต้องสมบูรณ์ มีแนวคิดและการนำเสนอที่ชัดเจน',
    'question03' => 'เป็นผลงานที่มีแหล่งอ้างอิงที่ถูกต้อง การใช้ภาษาที่ชัดเจน เหมาะสม',
    'question04' => 'เป็นผลงานที่มีการนำเสนอที่ชัดเจน มีเอกภาพ ไม่สับสน',
    'question05' => 'เป็นผลงานที่มีการวิเคราะห์และเสนอความรู้หรือวิธีการที่ทันสมัย',
    'question06' => 'เป็นผลงานที่มีเนื้อหาสาระทางวิชาการที่ทันสมัย',
    'question07' => 'เป็นผลงานที่สามารถนำไปใช้เป็นแหล่งอ้างอิงหรือนำไปปฏิบัติได้',
    'question08' => 'เป็นผลงานที่มีลักษณะเป็นงานบุกเบิกความรู้ใหม่ในเรื่องใดเรื่องหนึ่ง',
    'question09' => 'เป็นผลงานที่มีการกระตุ้นให้เกิดความคิดและค้นคว้าอย่างต่อเนื่อง',
    'question10' => 'เป็นผลงานที่มีการวิเคราะห์อย่างเป็นระบบ และสรุปประเด็นการวิเคราะห์'
   ];
   return [
    'success' => true,
    'questions' => $defaultQuestions
   ];
  }

  return [
   'success' => true,
   'questions' => $result
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * บันทึกผลการประเมิน
 */
function submitEvaluation($config, $data)
{
 try {
  $paperNo = $data['paperNo'];
  $email = $data['email'];
  $evaluationRound = $data['evaluationRound'] ?? 1;
  $scores = $data['scores']; // array ของคะแนน [at01, at02, ...]
  $status = $data['status']; // 1=ตอบรับ, 2=แก้ไขเล็กน้อย, 3=แก้ไขมาก, 4=ไม่ตอบรับ
  $note = $data['note'] ?? '';
  $file = $data['file'] ?? '';

  // ตรวจสอบว่าประเมินแล้วหรือยัง
  $table = $evaluationRound == 1 ? 'paper_evaluator' : 'paper_evaluator2';

  $checkSql = "SELECT no FROM {$table} WHERE no = :paperNo";
  $checkStmt = $config->CON->prepare($checkSql);
  $checkStmt->execute(['paperNo' => $paperNo]);

  if ($checkStmt->fetch()) {
   return ['error' => 'Paper already evaluated in this round'];
  }

  // คำนวณคะแนนรวม
  $totalScore = array_sum($scores) * 2; // คูณ 2 ตามที่เห็นในโค้ดเดิม

  // บันทึกการประเมิน
  $sql = "INSERT INTO {$table} (
                    no, status, 
                    at01, at02, at03, at04, at05, 
                    at06, at07, at08, at09, at10,
                    note, file
                ) VALUES (
                    :no, :status,
                    :at01, :at02, :at03, :at04, :at05,
                    :at06, :at07, :at08, :at09, :at10,
                    :note, :file
                )";

  $stmt = $config->CON->prepare($sql);
  $params = [
   'no' => $paperNo,
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

  // อัปเดตคะแนนใน paper table
  $updateSql = "UPDATE paper SET 
                        score = :score, 
                        status = :status,
                        scoreMax = 100,
                        dateE = NOW()
                      WHERE no = :paperNo";

  $updateStmt = $config->CON->prepare($updateSql);
  $updateStmt->execute([
   'score' => $totalScore,
   'status' => $status,
   'paperNo' => $paperNo
  ]);

  // ตรวจสอบว่าประเมินครบรอบหรือยัง และอัปเดตสถานะ
  checkAndUpdateFinalStatus($config, $paperNo);

  return [
   'success' => true,
   'message' => 'Evaluation submitted successfully',
   'totalScore' => $totalScore
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ตรวจสอบและอัปเดตสถานะสุดท้าย
 */
function checkAndUpdateFinalStatus($config, $paperNo)
{
 try {
  // ตรวจสอบว่ามีการประเมินครบรอบหรือยัง
  $sql = "SELECT 
                    pe1.no as eval1,
                    pe2.no as eval2,
                    (COALESCE(pe1.at01,0) + COALESCE(pe1.at02,0) + COALESCE(pe1.at03,0) + 
                     COALESCE(pe1.at04,0) + COALESCE(pe1.at05,0) + COALESCE(pe1.at06,0) + 
                     COALESCE(pe1.at07,0) + COALESCE(pe1.at08,0) + COALESCE(pe1.at09,0) + 
                     COALESCE(pe1.at10,0)) * 2 as score1,
                    (COALESCE(pe2.at01,0) + COALESCE(pe2.at02,0) + COALESCE(pe2.at03,0) + 
                     COALESCE(pe2.at04,0) + COALESCE(pe2.at05,0) + COALESCE(pe2.at06,0) + 
                     COALESCE(pe2.at07,0) + COALESCE(pe2.at08,0) + COALESCE(pe2.at09,0) + 
                     COALESCE(pe2.at10,0)) * 2 as score2,
                    pe1.status as status1,
                    pe2.status as status2
                FROM paper p
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                WHERE p.no = :paperNo";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  $evaluationCount = 0;
  $totalScore = 0;
  $finalStatus = 0;

  if ($result['eval1']) {
   $evaluationCount++;
   $totalScore += $result['score1'];
  }

  if ($result['eval2']) {
   $evaluationCount++;
   $totalScore += $result['score2'];
  }

  // ถ้ามีการประเมินแล้ว คำนวณคะแนนเฉลี่ยและสถานะ
  if ($evaluationCount > 0) {
   $averageScore = $totalScore / $evaluationCount;
   $percentage = ($averageScore / 100) * 100;

   // กำหนดสถานะตามคะแนน
   if ($percentage >= 80) {
    $finalStatus = 1; // ตอบรับ
   } elseif ($percentage >= 70) {
    $finalStatus = 2; // แก้ไขเล็กน้อย
   } elseif ($percentage >= 60) {
    $finalStatus = 3; // แก้ไขมาก
   } else {
    $finalStatus = 4; // ไม่ตอบรับ
   }

   // อัปเดตสถานะสุดท้าย
   $updateSql = "UPDATE paper SET 
                            score = :averageScore,
                            status = :status,
                            evaluationComplete = :complete,
                            dateE = NOW()
                          WHERE no = :paperNo";

   $updateStmt = $config->CON->prepare($updateSql);
   $updateStmt->execute([
    'averageScore' => $averageScore,
    'status' => $finalStatus,
    'complete' => ($evaluationCount >= 2 || $finalStatus == 4) ? 1 : 0,
    'paperNo' => $paperNo
   ]);
  }
 } catch (PDOException $e) {
  error_log("Error in checkAndUpdateFinalStatus: " . $e->getMessage());
 }
}

/**
 * ดึงรายการการประเมินของผู้ประเมิน
 */
function getMyEvaluations($config, $email)
{
 try {
  $sql = "SELECT DISTINCT
                    ne.noPaper,
                    p.titleNews,
                    p.name as authorName,
                    p.status,
                    p.score,
                    p.dateE,
                    pe1.no as evaluated1,
                    pe2.no as evaluated2
                FROM news_evaluator ne
                LEFT JOIN paper p ON ne.noPaper = p.no
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                WHERE ne.email = :email
                ORDER BY p.dateE DESC";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['email' => $email]);
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  return [
   'success' => true,
   'evaluations' => $results
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}

/**
 * ตรวจสอบว่าประเมินแล้วหรือยัง
 */
function checkEvaluationExists($config, $paperNo, $email)
{
 try {
  // ตรวจสอบว่าเป็นผู้ประเมินของบทความนี้หรือไม่
  $checkEvaluatorSql = "SELECT COUNT(*) as count FROM news_evaluator 
                              WHERE noPaper = :paperNo AND email = :email";
  $checkStmt = $config->CON->prepare($checkEvaluatorSql);
  $checkStmt->execute(['paperNo' => $paperNo, 'email' => $email]);
  $evaluatorCheck = $checkStmt->fetch(PDO::FETCH_ASSOC);

  if ($evaluatorCheck['count'] == 0) {
   return ['error' => 'You are not assigned to evaluate this paper'];
  }

  // ตรวจสอบการประเมิน
  $sql = "SELECT 
                    pe1.no as eval1_exists,
                    pe2.no as eval2_exists
                FROM paper p
                LEFT JOIN paper_evaluator pe1 ON p.no = pe1.no
                LEFT JOIN paper_evaluator2 pe2 ON p.no = pe2.no
                WHERE p.no = :paperNo";

  $stmt = $config->CON->prepare($sql);
  $stmt->execute(['paperNo' => $paperNo]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  return [
   'success' => true,
   'round1_completed' => !empty($result['eval1_exists']),
   'round2_completed' => !empty($result['eval2_exists']),
   'current_round' => empty($result['eval1_exists']) ? 1 : (empty($result['eval2_exists']) ? 2 : 'completed')
  ];
 } catch (PDOException $e) {
  return ['error' => $e->getMessage()];
 }
}
