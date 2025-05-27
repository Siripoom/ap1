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
    case 'fetch':
      $no = $input['no'];
      try {
        $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'register':
      $no = $input['no'];
      $paperNo = $input['no'];
      $noNews = $input['noNews'];
      $titleNews = $input['titleNews'];
      $typesNews = $input['typesNews'];
      $dateSNews = $input['dateSNews'];
      $dateENews = $input['dateENews'];
      $textNews = $input['textNews'];
      $email = $input['email'];
      $name = $input['name'];
      $role = $input['role'];
      $fields = $input['fields'];
      $faculty = $input['faculty'];
      $university = $input['university'];
      $file = $input['file'];
      $date = $input['date'];
      try {
        $sql = 'SELECT no,noNews,email FROM ' . $table . ' WHERE noNews = :noNews AND email = :email';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'noNews' => $noNews,
          'email' => $email
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
          $sql = 'INSERT INTO ' . $table . ' (
            no,
            noNews,
            titleNews,
            typesNews,
            dateSNews,
            dateENews,
            textNews,
            email,
            name,
            role,
            fields,
            faculty,
            university,
            date
          ) VALUES (
            :no,
            :noNews,
            :titleNews,
            :typesNews,
            :dateSNews,
            :dateENews,
            :textNews,
            :email,
            :name,
            :role,
            :fields,
            :faculty,
            :university,
            :date
          )';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'no' => $no,
            'noNews' => $noNews,
            'titleNews' => $titleNews,
            'typesNews' => $typesNews,
            'dateSNews' => $dateSNews,
            'dateENews' => $dateENews,
            'textNews' => $textNews,
            'email' => $email,
            'name' => $name,
            'role' => $role,
            'fields' => $fields,
            'faculty' => $faculty,
            'university' => $university,
            'date' => $date
          ]);
        }
        if ($result) {
          $no = $result['no'];
        }
        $sql = 'UPDATE ' . $table . ' SET
          file = :file
        WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'file' => $file
        ]);
        // if ($result) {
        //   // $paperNo = $result['no'];
        // }
        // $sql = 'INSERT INTO ' . $table . '_log (
        //   no,
        //   paperNo,
        //   file,
        //   date,
        //   email,
        //   name
        // ) VALUES (
        //   :no,
        //   :paperNo,
        //   :file,
        //   :date,
        //   :email,
        //   :name
        // )';
        // $stmt = $config->CON->prepare($sql);
        // $stmt->execute([
        //   'no' => $no,
        //   'paperNo' => $paperNo,
        //   'file' => $file,
        //   'date' => $date,
        //   'email' => $email,
        //   'name' => $name
        // ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
  }
}
?>