<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $name string */
/* @var $message string */
/* @var $exception Exception */

$this->title = $name;
?>
<div class="site-error container">
    <img id="page-not-found" src="/dist/img/generic/404.png">

    <?php if (!Yii::$app->user->getIsGuest()): ?>
        <div id="description">
            <div id="title">We can't find the page you're looking for...</div>
            <div id="error"><?= 'Error: ' . nl2br(Html::encode($message)) ?></div>
            <ul class="list-unstyled">
                <li>Here are some helpful links instead:</li>
                <li><a href="/site/dashboard">Dashboard</a></li>
                <li><a href="/book/index">Books</a></li>
                <li><a href="/site/about?slug=about">About us</a></li>
            </ul>            
        </div>
    <?php endif; ?>

</div>
