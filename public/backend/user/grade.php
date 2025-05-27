<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, x-requested-with');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  require('config.php');
  $config = new config();
  $content = file_get_contents('php://input');
  $input = json_decode($content, true);
  $header = $input['header'];
  $table = $input['table'];
  $sql = null;
  $stmt = null;
  switch ($header) {
    case 'paper':
      $email = $input['email'];
      try {
        $sql = 'SELECT * FROM ' . $table . ' WHERE (score01 = :email01 OR score02 = :email02 OR score03 = :email03 OR score04 = :email04) AND end = 0';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'email01' => $email,
          'email02' => $email,
          'email03' => $email,
          'email04' => $email
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
?>