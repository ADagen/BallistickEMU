<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Stick Arena Classic - Leaderboard">
  <meta name="keywords" content="Stick,Arena,XGEN,XGENStudios,MMO,MMORPG,Browser,Game">
  <title>BallistickEMU - Leaderboard</title>
</head>

<?php

require('../database.php');

function getLeaderboard() {
  $db = new Database('127.0.0.1', 'root', '', 'ballistickemu');

  $html = '
  <tr>
  <td style="padding: 8px;">#</td>
  <td style="padding: 8px;">Player</td>
  <td style="padding: 8px;">Kills</td>
  <td style="padding: 8px;">Deaths</td>
  <td style="padding: 8px;">Wins</td>
  <td style="padding: 8px;">Losses</td>
  </tr>
  ';

  $data = $db->getLeaderboard();

  foreach ($data as $key => $player) {
    $key += 1; // Position
    $html .='<tr style="background-color: #e3e6e9;">';
    $html .='<td style="padding: 8px; text-align: center;">'.$key.'</td>';
    $html .='<td style="padding: 8px;">'.$player['username'].'</td>';
    $html .='<td style="padding: 8px;">'.$player['kills'].'</td>';
    $html .='<td style="padding: 8px;">'.$player['deaths'].'</td>';
    $html .='<td style="padding: 8px;">'.$player['wins'].'</td>';
    $html .='<td style="padding: 8px;">'.$player['losses'].'</td></tr>';
  }

  return $html;
}

?>

<body>
  <div style="width: 520px; margin: 0 auto; background: #fff; box-shadow: 0px 2px 3px #98a0aa;">
    <h1><center>BallistickEMU - Leaderboard</h1></center>
    <table cellspacing="0" cellpadding="0" align="center" style="width: 520px;">
      <?php echo getLeaderboard(); ?>
    </table>
  </div>
</body>

</html>
