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
  $table = $input['table'];
  $sql = null;
  $stmt = null;
  switch ($header) {
    case 'fetch':
      $no = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'fetchNews':
      $title = $input['title'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE title = :title';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'title' => $title
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'fetchQuestion':
      $title = $input['title'];
      $sql = 'SELECT * FROM news WHERE title = :title';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'title' => $title
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
        $newsNo = $result['no'];
        $sql = 'SELECT * FROM paper_question WHERE newsNo = :newsNo';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'newsNo' => $newsNo
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'evaluator':
      $no = $input['no'];
      $status = $input['status'];
      $at01 = $input['at01'];
      $at02 = $input['at02'];
      $at03 = $input['at03'];
      $at04 = $input['at04'];
      $at05 = $input['at05'];
      $at06 = $input['at06'];
      $at07 = $input['at07'];
      $at08 = $input['at08'];
      $at09 = $input['at09'];
      $at10 = $input['at10'];
      $note = $input['note'];
      $file = $input['file'];
      $score = $input['score'];
      $scoreMax = $input['scoreMax'];

      $sql = 'UPDATE paper SET status = :status,score = :score,scoreMax = :scoreMax,file2 = :file2 WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'status' => $status,
        'score' => $score,
        'scoreMax' => $scoreMax,
        'file2' => $file,
      ]);

      $sql = 'INSERT INTO paper_evaluator (
        no,
        status,
        at01,
        at02,
        at03,
        at04,
        at05,
        at06,
        at07,
        at08,
        at09,
        at10,
        note,
        file
      ) VALUES (
        :no,
        :status,
        :at01,
        :at02,
        :at03,
        :at04,
        :at05,
        :at06,
        :at07,
        :at08,
        :at09,
        :at10,
        :note,
        :file
      )';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'status' => $status,
        'at01' => $at01,
        'at02' => $at02,
        'at03' => $at03,
        'at04' => $at04,
        'at05' => $at05,
        'at06' => $at06,
        'at07' => $at07,
        'at08' => $at08,
        'at09' => $at09,
        'at10' => $at10,
        'note' => $note,
        'file' => $file
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;

    case 'evaluator2':
      $no = $input['no'];
      $status = $input['status'];
      $at01 = $input['at01'];
      $at02 = $input['at02'];
      $at03 = $input['at03'];
      $at04 = $input['at04'];
      $at05 = $input['at05'];
      $at06 = $input['at06'];
      $at07 = $input['at07'];
      $at08 = $input['at08'];
      $at09 = $input['at09'];
      $at10 = $input['at10'];
      $note = $input['note'];
      $file = $input['file'];
      $score = $input['score'];
      $scoreMax = $input['scoreMax'];

      $sql = 'UPDATE paper SET status = :status,score = :score,scoreMax = :scoreMax WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'status' => $status,
        'score' => $score,
        'scoreMax' => $scoreMax
      ]);

      $sql = 'INSERT INTO paper_evaluator2 (
          no,
          status,
          at01,
          at02,
          at03,
          at04,
          at05,
          at06,
          at07,
          at08,
          at09,
          at10,
          note,
          file
        ) VALUES (
          :no,
          :status,
          :at01,
          :at02,
          :at03,
          :at04,
          :at05,
          :at06,
          :at07,
          :at08,
          :at09,
          :at10,
          :note,
          :file
        )';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'status' => $status,
        'at01' => $at01,
        'at02' => $at02,
        'at03' => $at03,
        'at04' => $at04,
        'at05' => $at05,
        'at06' => $at06,
        'at07' => $at07,
        'at08' => $at08,
        'at09' => $at09,
        'at10' => $at10,
        'note' => $note,
        'file' => $file
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
    case 'fetchEvaluator':
      $no = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
  }
}
?>