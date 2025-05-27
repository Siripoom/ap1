<?php
class config
{
  private $HOST = '127.0.0.1';
  private $USER = 'root';
  private $PASS = 'root123';
  private $DB = 'acadamicdb';
  public $CON;

  public function __construct()
  {
    try {
      $this->CON = new PDO('mysql:host=' . $this->HOST . ';dbname=' . $this->DB, $this->USER, $this->PASS);
      $this->CON->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
    }
  }
}
