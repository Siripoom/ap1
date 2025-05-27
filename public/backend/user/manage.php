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
    case 'fetch':
      $email = $input['email'];
      $table = $input['table'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'send':
      try {
        $newsNo = $input['newsNo'];
        $newsTitle = $input['newsTitle'];
        $email = $input['email'];
        $files = $input['files'];
        $rightsPublic = $input['rightsPublic'];
        $rightsContect = $input['rightsContect'];
        $sql = 'INSERT INTO paper (
        newsNo,
        newsTitle,
        email,
        files,
        rightsPublic,
        rightsContect
      ) VALUES (
        :newsNo,
        :newsTitle,
        :email,
        :files,
        :rightsPublic,
        :rightsContect
      )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'newsNo' => $newsNo,
          'newsTitle' => $newsTitle,
          'email' => $email,
          'files' => $files,
          'rightsPublic' => $rightsPublic,
          'rightsContect' => $rightsContect
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
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
  }
}
?>