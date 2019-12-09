<?php

final class Database extends PDO {
  public function __construct($host, $user, $password, $database) {
    $DSN = sprintf('mysql:dbname=%s;host=%s;charset=utf8mb4', $database, $host);

    try {
      parent::__construct($DSN, $user, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false
      ]);
    } catch (\PDOException $e) {
      throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }
  }
}

?>
