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
      $start = $input['start'];
      $stop = $input['stop'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE role != "developer" ORDER BY no ASC LIMIT ' . $start . ',' . $stop . '';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
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
    case 'setRole':
      $no = $input['no'];
      $role = $input['role'];
      $sql = 'UPDATE ' . $table . ' SET role = :role WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'role' => $role
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
  }

}
?>