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
  $sql = null;
  $stmt = null;
  switch ($header) {
    case 'signin':
      try {
        $email = $input['email'];
        $pass = $input['pass'];
        $sql = 'SELECT * FROM user WHERE email = :email';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'email' => $email
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
          $verify = password_verify($pass, $result['pass']);
          if ($verify) {
            if ($result['status'] == '1') {
              $sql = 'SELECT
                email,
                role,
                fields,
                faculty,
                university,
                title,
                fname,
                lname
              FROM user WHERE email = :email';
              $stmt = $config->CON->prepare($sql);
              $stmt->execute([
                'email' => $email
              ]);
              $result = $stmt->fetch(PDO::FETCH_ASSOC);
              echo json_encode($result, JSON_UNESCAPED_UNICODE);
            } else {
              echo json_encode('disable', JSON_UNESCAPED_UNICODE);
            }
          } else {
            echo json_encode('error', JSON_UNESCAPED_UNICODE);
          }
        } else {
          echo json_encode('error', JSON_UNESCAPED_UNICODE);
        }
      } catch (PDOException $error) {
        echo json_encode($error, JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
