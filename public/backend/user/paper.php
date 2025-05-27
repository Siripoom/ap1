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
    case 'upBill':
      $no = $input['no'];
      $bill = $input['bill'];
      $status = "0";
      try {
        $sql = 'UPDATE ' . $table . ' SET bill = :bill,status = :status WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'bill' => $bill,
          'status' => $status
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
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
      case 'fetchNews':
        $no = $input['no'];
        try {
          $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'no' => $no
          ]);
          $result = $stmt->fetch(PDO::FETCH_ASSOC);
          echo json_encode($result, JSON_UNESCAPED_UNICODE);
        } catch (PDOException $e) {
          echo json_encode($e, JSON_UNESCAPED_UNICODE);
        }
        break;
    case 'log':
      $paperNo = $input['paperNo'];
      try {
        $sql = 'SELECT * FROM ' . $table . '_log WHERE paperNo = :paperNo ORDER BY date ASC';
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
          $paperNo = $result['no'];
        }
        $sql = 'INSERT INTO ' . $table . '_log (
          no,
          paperNo,
          file,
          date
        ) VALUES (
          :no,
          :paperNo,
          :file,
          :date
        )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'paperNo' => $paperNo,
          'file' => $file,
          'date' => $date
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'del':
      $no = $input['no'];
      $sql = 'DELETE FROM ' . $table . '_log WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
    case 'newFile':
      $no = $input['no'];
      $file = $input['file'];
      $sql = 'UPDATE ' . $table . ' SET file2 = :file2 WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no,
        'file2' => $file
      ]);
      echo json_encode('success', JSON_UNESCAPED_UNICODE);
      break;
    case 'evaluatorData':
      $no = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE no = :no';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'no' => $no
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'evaList01':
      $noPaper = $input['no'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noPaper' => $noPaper
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
      case 'evaList02':
        $noPaper = $input['no'];
        $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'noPaper' => $noPaper
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;
        case 'evaList03':
          $noPaper = $input['no'];
          $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'noPaper' => $noPaper
          ]);
          $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
          echo json_encode($result, JSON_UNESCAPED_UNICODE);
          break;
    case 'fetchQ':
      $newsNo = $input['noNews'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE newsNo = :newsNo';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'newsNo' => $newsNo
      ]);
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'addScore':
      $no = $input['no'];
      $noPaper = $input['noPaper'];
      $email = $input['email'];
      $at01 = $input['at01'];
      $at02 = $input['at02'];
      $at03 = $input['at03'];
      $at04 = $input['at04'];
      $at05 = $input['at05'];
      $at06 = $input['at06'];
      $at07 = $input['at07'];
      $at08 = $input['at08'];
      $at09 = $input['at09'];
      $at10 = $input['at10'];
      $note = $input['note'];
      $file = $input['file'];
      try {
        $sql = 'INSERT INTO ' . $table . ' (
          no,
          noPaper,
          email,
          at01,
          at02,
          at03,
          at04,
          at05,
          at06,
          at07,
          at08,
          at09,
          at10,
          note,
          file
        ) VALUES (
          :no,
          :noPaper,
          :email,
          :at01,
          :at02,
          :at03,
          :at04,
          :at05,
          :at06,
          :at07,
          :at08,
          :at09,
          :at10,
          :note,
          :file
        )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'noPaper' => $noPaper,
          'email' => $email,
          'at01' => $at01,
          'at02' => $at02,
          'at03' => $at03,
          'at04' => $at04,
          'at05' => $at05,
          'at06' => $at06,
          'at07' => $at07,
          'at08' => $at08,
          'at09' => $at09,
          'at10' => $at10,
          'note' => $note,
          'file' => $file
        ]);
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
    // case 'addScore':
    //   echo json_encode('9999', JSON_UNESCAPED_UNICODE);
    //   break;
    case 'checkScore':
      $noPaper = $input['no'];
      $email = $input['email'];
      $sql = 'SELECT * FROM ' . $table . ' WHERE noPaper = :noPaper AND email = :email';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute([
        'noPaper' => $noPaper,
        'email' => $email
      ]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'setST': 
      $no = $input['no'];
      $status = $input['status'];
      $saveST01 = $input['saveST01'];
      $saveST02 = $input['saveST02'];
      $saveST03 = $input['saveST03'];
      $saveTo = $input['saveTo'];
      $dateE = $input['dateE'];
      try {
        if ($saveTo == 1) {
          $sql = 'UPDATE ' . $table . ' SET
            saveST01 = :saveST01,
            status = :status
          WHERE no = :no';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'no' => $no,
            'saveST01' => $saveST01,
            'status' => $status
          ]);
        } else if ($saveTo == 2) {
          $sql = 'UPDATE ' . $table . ' SET
            saveST02 = :saveST02,
            status = :status
          WHERE no = :no';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'no' => $no,
            'saveST02' => $saveST02,
            'status' => $status
          ]);
        } else if ($saveTo == 3) {
          $sql = 'UPDATE ' . $table . ' SET
            saveST03 = :saveST03,
            status = :status,
            dateE = :dateE
          WHERE no = :no';
          $stmt = $config->CON->prepare($sql);
          $stmt->execute([
            'no' => $no,
            'saveST03' => $saveST03,
            'status' => $status,
            'dateE' => $dateE
          ]);
        }
        
        echo json_encode('success', JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode($e, JSON_UNESCAPED_UNICODE);
      }
      break;
      case 'upDoc02':
        $no = $input['no'];
        $file = $input['file'];
        $sql = 'UPDATE ' . $table . ' SET
          file2 = :file2
        WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'file2' => $file
        ]);
        echo json_encode("success", JSON_UNESCAPED_UNICODE);
        break;
      case 'upDoc03':
        $no = $input['no'];
        $file = $input['file'];
        $sql = 'UPDATE ' . $table . ' SET
          file3 = :file3
        WHERE no = :no';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'file3' => $file
        ]);
        echo json_encode("success", JSON_UNESCAPED_UNICODE);
        break;
  }
}
?>