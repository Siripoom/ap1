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
    case 'add':
      $no = $input["no"];
      $name = $input["name"];
      $email = $input["email"];
      $text = $input["text"];
      $date = $input["date"];
      try {
        $sql = 'INSERT INTO ' . $table . '(
          no,
          name,
          email,
          text,
          date
        ) VALUES (
          :no,
          :name,
          :email,
          :text,
          :date
        )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'name' => $name,
          'email' => $email,
          'text' => $text,
          'date' => $date
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
?>