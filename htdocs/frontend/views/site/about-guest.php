<?php
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use \common\widgets\DbText;


$this->title = 'About us';
?>
<div class="site-about">
    <h1>About us</h1>
    <?= DbText::widget(['key' => 'about-us-guest']); ?>
</div>
