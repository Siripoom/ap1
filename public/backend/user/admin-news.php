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
  $sql = null;
  $stmt = null;
  switch ($header) {
    case 'all':
      $sql = 'SELECT * FROM label ORDER BY no ASC';
      $stmt = $config->CON->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      break;
    case 'add':
      try {
        $no = $input['no'];
        $name = $input['name'];
        $unit = $input['unit'];
        $minStock = $input['minStock'];
        $maxStock = $input['maxStock'];
        $total = $input['total'];
        $sql = 'INSERT INTO label (
            no,
            name,
            unit,
            minStock,
            maxStock,
            total
          ) VALUES (
            :no,
            :name,
            :unit,
            :minStock,
            :maxStock,
            :total
          )';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'no' => $no,
          'name' => $name,
          'unit' => $unit,
          'minStock' => $minStock,
          'maxStock' => $maxStock,
          'total' => $total
        ]);
        echo json_encode("success", JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode("error", JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'set':
      try {
        $tmp = $input['tmp'];
        $no = $input['no'];
        $name = $input['name'];
        $unit = $input['unit'];
        $minStock = $input['minStock'];
        $maxStock = $input['maxStock'];
        $total = $input['total'];
        $sql = 'UPDATE label SET
            no = :no,
            name = :name,
            unit = :unit,
            minStock = :minStock,
            maxStock = :maxStock,
            total = :total
          WHERE no = :tmp';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'tmp' => $tmp,
          'no' => $no,
          'name' => $name,
          'unit' => $unit,
          'minStock' => $minStock,
          'maxStock' => $maxStock,
          'total' => $total
        ]);
        echo json_encode("success", JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode("error", JSON_UNESCAPED_UNICODE);
      }
      break;
    case 'del':
      try {
        $del = $input['del'];
        $sql = 'DELETE FROM label WHERE no = :del';
        $stmt = $config->CON->prepare($sql);
        $stmt->execute([
          'del' => $del
        ]);
        echo json_encode("success", JSON_UNESCAPED_UNICODE);
      } catch (PDOException $e) {
        echo json_encode("error", JSON_UNESCAPED_UNICODE);
      }
      break;
  }

}
?>
