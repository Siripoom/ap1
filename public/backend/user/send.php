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
    case 'send':
      try {
        $newsNo = $input['newsNo'];
        $newsTitle = $input['newsTitle'];
        $email = $input['email'];
        $files = $input['files'];
        $nameTH = $input['nameTH'];
        $nameEN = $input['nameEN'];
        $rightsPublic = $input['rightsPublic'];
        $rightsContect = $input['rightsContect'];
        $text = $input['text'];
        $types = $input['types'];
        $score01 = $input['score01'];
        $score02 = $input['score02'];
        $score03 = $input['score03'];
        $score04 = $input['score04'];
        $sql = 'INSERT INTO paper (
        newsNo,
        newsTitle,
        email,
        files,
        nameTH,
        nameEN,
        rightsPublic,
        rightsContect,
        text,
        types,
        score01,
        score02,
        score03,
        score04
      ) VALUES (
        :newsNo,
        :newsTitle,
        :email,
        :files,
        :nameTH,
        :nameEN,
        :rightsPublic,
        :rightsContect,
        :text,
        :types,
        :score01,
        :score02,
        :score03,
        :score04
      )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'newsNo' => $newsNo,
          'newsTitle' => $newsTitle,
          'email' => $email,
          'files' => $files,
          'nameTH' => $nameTH,
          'nameEN' => $nameEN,
          'rightsPublic' => $rightsPublic,
          'rightsContect' => $rightsContect,
          'text' => $text,
          'types' => $types,
          'score01' => $score01,
          'score02' => $score02,
          'score03' => $score03,
          'score04' => $score04
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
?>