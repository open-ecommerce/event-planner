<?php

use yii\helpers\Html;
use kartik\form\ActiveForm;
//use jakobreiter\quaggajs;

/* @var $this yii\web\View */
/* @var $model backend\models\search\BookSearch */
/* @var $form yii\bootstrap\ActiveForm */
?>


<div id="barcode-search">


    <?php
    $form = ActiveForm::begin([
                'action' => ['index'],
                'method' => 'get',
    ]);
    ?>

    <?php
    echo $form->field($model, 'barcodeSearch', [
        'addon' => [
            'prepend' => [
                'content' => '<i class="glyphicon glyphicon-barcode"></i>'
            ],
            'append' => [
                'content' => Html::submitButton(Yii::t('backend', '<i class="glyphicon glyphicon-search"></i>'), ['class' => 'btn btn-view']),
                'asButton' => true
            ]
        ]
    ])->textInput()->input('barcodeSearch', ['placeholder' => "Search by barcode"])->label(false);


//
//    echo jakobreiter\quaggajs\YiiQuagga::widget([
//        "id" => 'codereader',
//        'name' => 'BarcodeForm[number]',
//        'target' => '#barcodeform-number',
//        'messages' => '#messages',
//    ]);
//
//
//    ?>

    <?php ActiveForm::end(); ?>

</div>
