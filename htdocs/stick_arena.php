<?php

require('./database.php');

function isEmpty($keys) {
  for ($i = 0; $i < count($keys); $i++) {
    if (!isset($_POST[$keys[$i]]) || empty($_POST[$keys[$i]])) {
      return true;
    }
  }

  return false;
}

function isValidString($keys) {
  for ($i = 0; $i < count($keys); $i++) {
    if (!preg_match('/^[a-zA-Z0-9.,]{3,20}+$/', $_POST[$keys[$i]])) {
      return false;
    }
  }

  return true;
}

function isValidColor($usercol) {
  if (is_numeric($usercol) && strlen($usercol) === 9) {
    list($red, $green, $blue) = str_split($usercol, 3);

    // In range of the 8-bit RGB spectrum?
    $redOk = $red >= 0 && $red <= 255;
    $greenOk = $green >= 0 && $green <= 255;
    $blueOk = $blue >= 0 && $blue <= 255;

    return $redOk && $greenOk && $blueOk;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST) && isset($_POST['action'])) {
  $action = $_POST['action'];
  $db = new Database('127.0.0.1', 'root', '', 'ballistickemu');

  if ($action === 'create') {
    if (isEmpty(['username', 'userpass', 'usercol'])) return die('result=error');
    if (!isValidString(['username', 'userpass'])) return die('result=error');
    if (!isValidColor($_POST['usercol'])) return die('result=error');

    $db->createAccount($_POST['username'], $_POST['userpass'], $_POST['usercol']);
  } else if ($action === 'report_player') {
    if (isEmpty(['reporter_username', 'reported_username', 'reported_ip', 'msg'])) return die('result=error');
    if (!isValidString(['reporter_username', 'reported_username'])) return die('result=error');
    if (!filter_var($_POST['reported_ip'], FILTER_VALIDATE_IP) || strlen($_POST['msg']) > 250) return die('result=error');

    $db->reportPlayer($_POST['reporter_username'], $_POST['reported_username'], $_POST['reported_ip'], $_POST['msg']);
  } else {
    return die('result=error');
  }
} else {
  return die('result=error');
}

?>
