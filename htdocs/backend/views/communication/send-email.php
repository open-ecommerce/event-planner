<?php

use yii\widgets\ActiveForm;
use marqu3s\summernote\Summernote;
use kartik\helpers\Html;

/* @var $this yii\web\View */
/* @var $form yii\widgets\ActiveForm */

$this->title = 'Send Email';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="communication-send-email">

    <?php
    $form = ActiveForm::begin(['id' => 'communication-send-email']);

    $panelMail = '';
    $panelMail .= '<div class="row panel-body">';
    $panelMail .= '<div class="col-lg-12">';
    $panelMail .= $form->field($model, 'name');
    $panelMail .= $form->field($model, 'email');
    $panelMail .= $form->field($model, 'subject');
    $panelMail .= $form->field($model, 'body')->widget(Summernote::className(), [
        'clientOptions' => [
            'id' => 'body-summernote',
            'height' => 200,
            'placeholder' => 'Content of the Email...',
            'toolbar' => [
                ['style', ['style']],
                ['undo', ['undo']],
                ['redo', ['redo']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['fullscreen', 'codeview']],
            ]
        ],
            ]
    );
    $panelMail .= '<div class="form-group">';
    $panelMail .= Html::submitButton(Yii::t('backend', 'Submit'), ['class' => 'btn btn-primary', 'name' => 'contact-button']);
    $panelMail .= "</div>";
    $panelMail .= "</div>";
    $panelMail .= "</div>";
    echo Html::panel(['heading' => 'Sending Reports, Newsletters & Emails', 'body' => $panelMail], Html::TYPE_DEFAULT);

    ActiveForm::end();
    ?>

</div>

