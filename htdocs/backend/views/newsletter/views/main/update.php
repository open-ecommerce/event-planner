<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Equeue */

$this->title = 'Update Equeue';
$this->params['breadcrumbs'][] = ['label' => 'Equeues', 'url' => ['index']];
$this->params['breadcrumbs'][] = 'Update';
?>
<div class="main-update">

    <h3><?= Html::encode($this->title) ?></h3>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
