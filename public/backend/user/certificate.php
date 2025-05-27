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
      $sql = 'SELECT COUNT(no) FROM ' . $table . ' WHERE status = "1" ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result['COUNT(no)'], JSON_UNESCAPED_UNICODE);
      break;
    case 'fetch':
      $start = $input['start'];
      $stop = $input['stop'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE status = "1" ORDER BY no ASC LIMIT ' . $start . ',' . $stop . '';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'fetchOwner':
      $email = $input['email'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'checkScore':
      $noPaper = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noPaper' => $noPaper
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'maxScore':
      $newsNo = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE newsNo = :newsNo';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'newsNo' => $newsNo
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'listQA':
      $noPaper = $input['noPaper'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noPaper' => $noPaper
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
  
  }
}
?>