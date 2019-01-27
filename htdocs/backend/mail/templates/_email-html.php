<?php
use yii\helpers\Html;

/* @var $this \yii\web\View view component instance */
/* @var $message \yii\mail\MessageInterface the message bing composed */
/* @var $content string main view render result */

//this adds model element to the View object's params.
$this->params['model'] = $model; 

//In your layout


?>
<?php $this->beginPage() ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="css/app.css">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Custom email from London Literary Scouting</title>
    <!-- <style> -->
  </head>
<body>
    <?php $this->beginBody() ?>
    <?php echo $model->message_body ?>  
    <?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>