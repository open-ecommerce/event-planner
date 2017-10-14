<?php

use yii\helpers\Html;
use kartik\form\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\search\BookSearch */
/* @var $form yii\bootstrap\ActiveForm */
?>


<div id="global-search">

    <?php
    $form = ActiveForm::begin([
                'action' => ['index'],
                'method' => 'get',
    ]);
    ?>

    <?php
    echo $form->field($model, 'globalSearch', [
        'addon' => [
            'append' => [
                'content' => Html::submitButton(Yii::t('backend', '<i class="glyphicon glyphicon-search"></i>'), ['class' => 'btn btn-view']),
                'asButton' => true
            ]
        ]
    ])->textInput()->input('globalSearch', ['placeholder' => "Search globaly in titles and reports"])->label(false);
    ;
    ?>

    <?php ActiveForm::end(); ?>

</div>
