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
    case 'length':
      $sql = 'SELECT COUNT(no) FROM ' . $table . ' ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result['COUNT(no)'], JSON_UNESCAPED_UNICODE);
      break;
    case 'fetch':
      $no = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'fetchEvaPersonList':
      $sql = 'SELECT * FROM user WHERE role = "evaluator" ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'fetchReadyPersonList':
      $noPaper = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noPaper' => $noPaper
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'status':
      $no = $input['no'];
      $status = $input['status'];
      $sql = 'UPDATE ' . $table . ' SET status = :status WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'status' => $status
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
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
    case 'add':
      $no = $input['no'];
      $noPaper = $input['noPaper'];
      $email = $input['email'];
      $date = $input['date'];
      $sql = 'SELECT * FROM user WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      $name = $result['title'] . $result['fname'] . ' ' . $result['lname'];

      $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper AND email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noPaper' => $noPaper,
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
        echo json_encode('same', JSON_UNESCAPED_UNICODE);
      } else {
        $sql = 'INSERT INTO ' . $table . ' (
        no,
        noPaper,
        email,
        name,
        date
      ) VALUES (
        :no,
        :noPaper,
        :email,
        :name,
        :date
      )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'noPaper' => $noPaper,
          'email' => $email,
          'name' => $name,
          'date' => $date
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'set':
      $no = $input['no'];
      $name = $input['name'];
      $date = $input['date'];
      $file = $input['file'];
      $sql = 'UPDATE ' . $table . ' SET
        name = :name,
        date = :date,
        file = :file
      WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'name' => $name,
        'date' => $date,
        'file' => $file
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
  }

}
?>