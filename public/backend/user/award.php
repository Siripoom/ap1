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
      $types = $input['types'];
      if ($types == '') {
        $sql = 'SELECT COUNT(no) FROM ' . $table . ' WHERE status = "1" ORDER BY no ASC';
      } else {
        $sql = 'SELECT COUNT(no) FROM ' . $table . ' WHERE status = "1" AND types = "' . $types . '" ORDER BY no ASC';
      }
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result['COUNT(no)'], JSON_UNESCAPED_UNICODE);
      break;
    case 'fetch':
      $start = $input['start'];
      $stop = $input['stop'];
      $types = $input['types'];
      if ($types == '') {
        $sql = 'SELECT * FROM ' . $table . ' ORDER BY dateS DESC LIMIT ' . $start . ',' . $stop . '';
      } else {
        $sql = 'SELECT * FROM ' . $table . ' WHERE types = "' . $types . '" ORDER BY dateS DESC LIMIT ' . $start . ',' . $stop . '';
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
    case 'top':
      $noNews = $input['noNews'];
      $table = 'paper';
      $status = 1;
      $score = 0;
      try {
        $sql = 'SELECT * FROM ' . $table . ' WHERE noNews = :noNews AND status = :status AND score != :score ORDER BY score DESC LIMIT 3';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'noNews' => $noNews,
          'status' => $status,
          'score' => $score
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'evaluator':
      $paperNo = $input['paperNo'];
      try {
        $sql = 'SELECT * FROM ' . $table . '_evaluator WHERE paperNo = :paperNo';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'paperNo' => $paperNo
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