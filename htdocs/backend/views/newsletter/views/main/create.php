<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model app\models\Equeue */
/* @var $draftName string */

$this->title = 'Send Email';

$this->params['breadcrumbs'][] = $this->title;

?>
<div class="main-create">

    <?= Html::a('Drafts', ['/newsletter-draft/index'], [
        'class' => 'btn btn-info',
    ]); ?>

    <?= $this->render('_form', [
        'model' => $model,
        'draftName' => $draftName,
    ]) ?>

</div>
