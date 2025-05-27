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
    case 'news':
      try {
        $sql = 'SELECT * FROM ' . $table . ' ORDER BY dateStart DESC';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'paper':
      try {
        $newsNo = $input['newsNo'];
        $sql = 'SELECT * FROM ' . $table . ' WHERE newsNo = :newsNo AND end = 1 ORDER BY scoreSum DESC LIMIT 10';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'newsNo' => $newsNo
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