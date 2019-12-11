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

  public function usernameExists($username) {
    $q1 = $this->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
    $q1->execute(['username' => $username]);

    $usernameExists = $q1->fetchColumn();
    $q1->closeCursor();

    return $usernameExists;
  }

  public function addSpinner($id, $usercol) {
    list($red, $green, $blue) = str_split($usercol, 3);

    $q1 = $this->prepare(
      'INSERT INTO inventory
      (id, itemType, itemId, selected, redInner, greenInner, blueInner, redOuter, greenOuter, blueOuter)
      VALUES
      (:id, 1, 100, 1, :redInner, :greenInner, :blueInner, :redOuter, :greenOuter, :blueOuter)'
    );
    $q1->execute([
      'id'         => $id,
      'redInner'   => $red,
      'greenInner' => $green,
      'blueInner'  => $blue,
      'redOuter'   => $red,
      'greenOuter' => $green,
      'blueOuter'  => $blue
    ]);
    $q1->closeCursor();
  }

  public function addPetSlot($id) {
    $q1 = $this->prepare(
      'INSERT INTO inventory
      (id, itemType, itemId, selected, redInner, redOuter)
      VALUES
      (:id, 2, 200, 0, 0, 0)'
    );
    $q1->execute(['id' => $id]);
    $q1->closeCursor();
  }

  public function createAccount($username, $password, $usercol) {
    if ($this->usernameExists($username)) {
      return die('result=error');
    }

    $q1 = $this->prepare('INSERT INTO users (username, password) VALUES (:username, :password)');
    $q1->execute(['username' => $username, 'password' => password_hash($password, PASSWORD_ARGON2ID)]);
    $q1->closeCursor();

    $id = $this->lastInsertId();

    $this->addSpinner($id, $usercol);
    $this->addPetSlot($id);

    echo 'result=success';
  }

  public function reportPlayer($reporter_username, $reported_username, $reported_ip, $msg) {
    if (!$this->usernameExists($reporter_username) || !$this->usernameExists($reported_username)) {
      return die('result=error');
    }

    $q1 = $this->prepare(
      'INSERT INTO reports
      (reporter_username, reported_username, reported_ip, msg)
      VALUES
      (:reporter_username, :reported_username, :reported_ip, :msg)'
    );
    $q1->execute([
      'reporter_username' => $reporter_username,
      'reported_username' => $reported_username,
      'reported_ip'       => $reported_ip,
      'msg'               => $this->quote($msg)
    ]);
    $q1->closeCursor();

    echo 'result=success';
  }
}

?>
