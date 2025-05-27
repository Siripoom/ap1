<?php
// ทดสอบ PHP
echo "<h2>PHP Test</h2>";
echo "PHP Version: " . phpversion() . "<br>";

// ทดสอบการเชื่อมต่อฐานข้อมูล
try {
 require_once('config.php');
 $config = new config();
 echo "<h3>Database Connection: SUCCESS</h3>";

 // ทดสอบ query
 $stmt = $config->CON->prepare("SHOW TABLES");
 $stmt->execute();
 $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

 echo "<h4>Tables in database:</h4>";
 echo "<ul>";
 foreach ($tables as $table) {
  echo "<li>" . $table . "</li>";
 }
 echo "</ul>";
} catch (Exception $e) {
 echo "<h3>Database Connection: FAILED</h3>";
 echo "Error: " . $e->getMessage();
}
