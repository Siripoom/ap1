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
    case 'signup':
      try {
        $email = $input['email'];
        $pass = $input['pass'];
        $title = $input['title'];
        $fname = $input['fname'];
        $lname = $input['lname'];
        $titleEN = $input['titleEN'];
        $fnameEN = $input['fnameEN'];
        $lnameEN = $input['lnameEN'];
        $university = $input['university'];
        $faculty = $input['faculty'];
        $fields = $input['fields'];
        $role = $input['role'];
        $options = [
          'cost' => 12,
        ];
        $pass = password_hash($pass, PASSWORD_BCRYPT, $options);
        $sql = 'SELECT * FROM ' . $table . ' WHERE email = :email';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'email' => $email
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
          echo json_encode('disable', JSON_UNESCAPED_UNICODE);
        } else {
          $sql = 'INSERT INTO ' . $table . ' (
          email,
          pass,
          title,
          fname,
          lname,
          titleEN,
          fnameEN,
          lnameEN,
          university,
          faculty,
          fields,
          role
        ) VALUES (
          :email,
          :pass,
          :title,
          :fname,
          :lname,
          :titleEN,
          :fnameEN,
          :lnameEN,
          :university,
          :faculty,
          :fields,
          :role
        )';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'email' => $email,
            'pass' => $pass,
            'title' => $title,
            'fname' => $fname,
            'lname' => $lname,
            'titleEN' => $titleEN,
            'fnameEN' => $fnameEN,
            'lnameEN' => $lnameEN,
            'university' => $university,
            'faculty' => $faculty,
            'fields' => $fields,
            'role' => $role
          ]);
        }
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
?>