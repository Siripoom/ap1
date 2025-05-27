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
    case 'fetchEvaluator':
      $email = $input['email'];
      $sql = 'SELECT * FROM news_evaluator WHERE email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'email' => $email
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'fetch':
      $start = $input['start'];
      $stop = $input['stop'];
      $types = $input['types'];
      $noNews = $input['noNews'];
      // $email = $input['email'];
      // $sql = 'SELECT * FROM news_evaluator WHERE email = :email';
      // $stmt = $config->CON->prepare($sql);
      // $stmt->execute([
      //   'email' => $email
      // ]);
      // $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      // if ($result) {
      //   $evalutor = $result;
      //   for ($i = 0; $i < count($evalutor); $i++) {
      if ($types == '') {
        $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no AND status = "0" ORDER BY dateSNews DESC LIMIT ' . $start . ',' . $stop . '';
      } else {
        $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no AND status = "0" AND typesNews = "' . $types . '" ORDER BY dateSNews DESC LIMIT ' . $start . ',' . $stop . '';
      }
      try {
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $noNews
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      //   }
      //   echo json_encode($evalutor, JSON_UNESCAPED_UNICODE);
      // } else {
      //   echo json_encode($result, JSON_UNESCAPED_UNICODE);
      // }
      // echo json_encode($result, JSON_UNESCAPED_UNICODE);
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
  }
}
?>