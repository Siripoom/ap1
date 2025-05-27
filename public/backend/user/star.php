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
      $paperNo = $input["no"];
      $user = $input["email"];
      try {
        $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $paperNo
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user == $result['score01'] && $result['ss01'] > 0) {
          echo json_encode('success', JSON_UNESCAPED_UNICODE);
        } elseif ($user == $result['score02'] && $result['ss02'] > 0) {
          echo json_encode('success', JSON_UNESCAPED_UNICODE);
        } elseif ($user == $result['score03'] && $result['ss03'] > 0) {
          echo json_encode('success', JSON_UNESCAPED_UNICODE);
        } elseif ($user == $result['score04'] && $result['ss04'] > 0) {
          echo json_encode('success', JSON_UNESCAPED_UNICODE);
        } else {
          echo json_encode('unsuccess', JSON_UNESCAPED_UNICODE);
        }
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'ss':
      $paperNo = $input["paperNo"];
      $user = $input["email"];
      try {
        $sql = 'SELECT * FROM ' . $table . ' WHERE paperNo = :paperNo AND user = :user';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'paperNo' => $paperNo,
          'user' => $user
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'star':
      $paperNo = $input["no"];
      $user = $input["email"];
      $ss01 = $input["ss01"];
      $ss02 = $input["ss02"];
      $ss03 = $input["ss03"];
      $ss04 = $input["ss04"];
      $ss05 = $input["ss05"];
      $ssNote = $input["ssNote"];
      $ssFile = $input["ssFile"];
      $score = $ss01 + $ss02 + $ss03 + $ss04 + $ss05;
      try {
        $sql = 'INSERT INTO paper_score (
          user,
          paperNo,
          ss01,
          ss02,
          ss03,
          ss04,
          ss05,
          ssNote,
          ssFile
        ) VALUES (
          :user,
          :paperNo,
          :ss01,
          :ss02,
          :ss03,
          :ss04,
          :ss05,
          :ssNote,
          :ssFile
        )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'user' => $user,
          'paperNo' => $paperNo,
          'ss01' => $ss01,
          'ss02' => $ss02,
          'ss03' => $ss03,
          'ss04' => $ss04,
          'ss05' => $ss05,
          'ssNote' => $ssNote,
          'ssFile' => $ssFile
        ]);
        $sql = 'SELECT * FROM paper WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $paperNo
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user == $result['score01']) {
          $sql = 'UPDATE paper SET ss01 = :score WHERE no = :no';
        } elseif ($user == $result['score02']) {
          $sql = 'UPDATE paper SET ss02 = :score WHERE no = :no';
        } elseif ($user == $result['score03']) {
          $sql = 'UPDATE paper SET ss03 = :score WHERE no = :no';
        } elseif ($user == $result['score04']) {
          $sql = 'UPDATE paper SET ss04 = :score WHERE no = :no';
        }
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'score' => $score,
          'no' => $paperNo
        ]);
        $sql = 'SELECT * FROM paper WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $paperNo
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result['ss01'] > 0 && $result['ss02'] > 0 && $result['ss03'] > 0 && $result['ss04'] > 0) {
          $today = date("Y-m-d");
          $scoreSum = $result['ss01'] + $result['ss02'] + $result['ss03'] + $result['ss04'];
          $sql = 'UPDATE paper SET dateEnd = :dateEnd,end = "1",scoreSum = :scoreSum WHERE no = :no';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'dateEnd' => $today,
            'scoreSum' => $scoreSum,
            'no' => $paperNo
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