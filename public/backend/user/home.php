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
      $role = $input['role'];
      if ($role == 'developer') {
        $sql = 'SELECT * FROM ' . $table . ' ORDER BY dateS DESC';
      } else {
        $sql = 'SELECT * FROM ' . $table . ' WHERE status = "1" ORDER BY dateS DESC';
      }
      try {
        $stmt = $config->CON->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'types':
      try {
        $sql = 'SELECT * FROM ' . $table . ' ORDER BY name ASC';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'scoreList':
      $email = $input['email'];
      try {
        $sql = 'SELECT * FROM ' . $table . ' WHERE email != :email ORDER BY fnameTH ASC';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'email' => $email
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'add':
      $no = $input['no'];
      $title = $input['title'];
      $types = $input['types'];
      $dateS = $input['dateS'];
      $dateE = $input['dateE'];
      $text = $input['text'];
      $status = $input['status'];
      $round = $input['round'];
      try {
        $sql = 'INSERT INTO ' . $table . ' (
          no,
          title,
          types,
          dateS,
          dateE,
          status,
          round,
          text
        ) VALUES (
          :no,
          :title,
          :types,
          :dateS,
          :dateE,
          :status,
          :round,
          :text
        )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'title' => $title,
          'types' => $types,
          'dateS' => $dateS,
          'dateE' => $dateE,
          'status' => $status,
          'round' => $round,
          'text' => $text
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'set':
      $no = $input['no'];
      $title = $input['title'];
      $types = $input['types'];
      $dateS = $input['dateS'];
      $dateE = $input['dateE'];
      $status = $input['status'];
      $round = $input['round'];
      $text = $input['text'];
      try {
        $sql = 'UPDATE ' . $table . ' SET
          title = :title,
          types = :types,
          dateS = :dateS,
          dateE = :dateE,
          status = :status,
          round = :round,
          text = :text
         WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'title' => $title,
          'types' => $types,
          'dateS' => $dateS,
          'dateE' => $dateE,
          'status' => $status,
          'round' => $round,
          'text' => $text
        ]);
        // echo json_encode('success', JSON_UNESCAPED_UNICODE);
        if ($status == 1) {
          # code...
        }

      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'del':
      $no = $input['no'];
      $sql = 'DELETE FROM ' . $table . ' WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
    case 'roleEveluator':
      $sql = 'SELECT *  FROM ' . $table . ' WHERE role = "evaluator"';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'personEvaluator':
      $noNews = $input['noNews'];
      $sql = 'SELECT *  FROM paper WHERE noNews = :noNews ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noNews' => $noNews
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'delPersonEvaluator':
      $no = $input['no'];
      $sql = 'DELETE FROM paper WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
    case 'addEvaluatorPerson':
      $no = $input['no'];
      $noNews = $input['noNews'];
      $email = $input['email'];
      $date = $input['date'];
      $sql = 'SELECT * FROM user WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
        $name = $result['title'] . $result['fname'] . ' ' . $result['lname'];
        $sql = 'INSERT INTO ' . $table . ' (
          no,
          noNews,
          email,
          name,
          date
        ) VALUES (
          :no,
          :noNews,
          :email,
          :name,
          :date
        )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'noNews' => $noNews,
          'email' => $email,
          'name' => $name,
          'date' => $date,
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } else {
        echo json_encode('error', JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'addEvaluatorPaper':
      $no = $input['no'];
      $email = $input['email'];
      $sql = 'SELECT * FROM user WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
        $name = $result['title'] . $result['fname'] . ' ' . $result['lname'];
        $sql = 'UPDATE paper SET
          evaluatorEmail = :evaluatorEmail,
          evaluatorName = :evaluatorName
        WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'evaluatorEmail' => $email,
          'evaluatorName' => $name
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } else {
        echo json_encode('error', JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'addQuestion':
      $email = $input['email'];
      $newsNo = $input['newsNo'];
      $question01 = $input['question01'];
      $question02 = $input['question02'];
      $question03 = $input['question03'];
      $question04 = $input['question04'];
      $question05 = $input['question05'];
      $question06 = $input['question06'];
      $question07 = $input['question07'];
      $question08 = $input['question08'];
      $question09 = $input['question09'];
      $question10 = $input['question10'];
      $sql = 'SELECT * FROM user WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
        $name = $result['title'] . $result['fname'] . ' ' . $result['lname'];
        $sql = 'SELECT newsNo FROM ' . $table . ' WHERE newsNo = :newsNo';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'newsNo' => $newsNo
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
          // echo json_encode('update', JSON_UNESCAPED_UNICODE);
          $sql = 'UPDATE ' . $table . ' SET
                question01 = :question01,
                question02 = :question02,
                question03 = :question03,
                question04 = :question04,
                question05 = :question05,
                question06 = :question06,
                question07 = :question07,
                question08 = :question08,
                question09 = :question09,
                question10 = :question10
              WHERE newsNo = :newsNo';
        } else {
          // echo json_encode('insert', JSON_UNESCAPED_UNICODE);
          $sql = 'INSERT INTO ' . $table . ' (
            newsNo,          
            question01,
            question02,
            question03,
            question04,
            question05,
            question06,
            question07,
            question08,
            question09,
            question10
          ) VALUES (
            :newsNo,
            :question01,
            :question02,
            :question03,
            :question04,
            :question05,
            :question06,
            :question07,
            :question08,
            :question09,
            :question10
          )';
        }
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'newsNo' => $newsNo,
          'question01' => $question01,
          'question02' => $question02,
          'question03' => $question03,
          'question04' => $question04,
          'question05' => $question05,
          'question06' => $question06,
          'question07' => $question07,
          'question08' => $question08,
          'question09' => $question09,
          'question10' => $question10
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } else {
        echo json_encode('error', JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'fetchQuestion':
      $newsNo = $input['newsNo'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE newsNo = :newsNo';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'newsNo' => $newsNo
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } else {
        echo json_encode('error', JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
?>