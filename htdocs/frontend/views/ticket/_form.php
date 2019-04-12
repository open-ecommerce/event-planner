<?php

use trntv\filekit\widget\Upload;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use marqu3s\summernote\Summernote;
use yii\web\JsExpression;
use common\models\TicketType;
use kartik\tabs\TabsX;
use kartik\widgets\SwitchInput;
use dosamigos\selectize\SelectizeDropDownList;

/* @var $this yii\web\View */
/* @var $model common\models\Ticket */
/* @var $form yii\bootstrap\ActiveForm */
?>


<div class="ticket-form">
    <?php $form = ActiveForm::begin(); ?>

    <?= $form->errorSummary($model, ['header' => '<h3>Ops Looks like there are some empty requred fields.</h3>']); ?>
    <div class="form-group">
        <?= Html::a('Cancel and Close', ['ticket/index'], ['class' => 'btn btn-warning']) ?>
        <?= Html::submitButton($model->isNewRecord ? 'Confirm Entry and Close' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
    </div>
    <?php
    $tabProfile = '';
    $tabProfile .= '<div class="row" id="update-profile">';
    $tabProfile .= '<div class="col-md-6" id="wrap-main">';
    $tabProfile .= '<div class="col-md-4">';
   
    $tabProfile .= $form->field($model, 'thumbnail')->widget(
            Upload::className(), [
        'url' => ['/file-storage/upload'],
        'maxFileSize' => 5000000, // 5 MiB
    ]);    
    
    $tabProfile .= '</div>';
    $tabProfile .= '<div class="col-md-8">';
    $tabProfile .= $form->field($model, 'barcode')->textInput(['maxlength' => 255]);
    $tabProfile .= $form->field($model, 'first_name')->textInput(['maxlength' => 255]);
    $tabProfile .= $form->field($model, 'last_name')->textInput(['maxlength' => 255]);
    $tabProfile .= '</div>';
    $tabProfile .= $form->field($model, 'notes')->widget(
            \yii\imperavi\Widget::className(), [
        'plugins' => ['fullscreen', 'fontcolor'],
        'options' => [
            'minHeight' => 200,
            'maxHeight' => 200,
            'buttonSource' => true,
            'convertDivs' => false,
            'removeEmptyTags' => false,
            'imageUpload' => Yii::$app->urlManager->createUrl(['/file-storage/upload-imperavi'])
        ]
            ]
    );
    $tabProfile .= '</div>';
    $tabProfile .= '<div class="col-md-6" id="wrap-detail">';
    $tabProfile .= $form->field($model, 'ticket_status')->dropDownList(['PAID' => 'PAID', 'NOT PAID' => 'NOT PAID', "FREE"=>"FREE"],['prompt'=>'Select Option']);
    $tabProfile .= $form->field($model, 'ticket_type_id')->widget(SelectizeDropDownList::className(), [
        'loadUrl' => ['ticket/types'],
        'value' => $ticketType,
        'items' => \yii\helpers\ArrayHelper::map(TicketType::find()->orderBy('ticket_name')->asArray()->all(), 'id', 'ticket_name'),
        'options' => [
            'class' => 'form-control',
            'id' => 'id-tikets',
            'prompt' => 'Select the ticket type',
        ],
        'clientOptions' => [
            'valueField' => 'id',
            'labelField' => 'ticket_name',
            'searchField' => ['ticket_name'],
            'autosearch' => ['on'],
            'create' => false,
        ],
    ]);
    $tabProfile .= $form->field($model, 'ticket_date')->textInput(['maxlength' => 255]);
    $tabProfile .= $form->field($model, 'attendee_id')->textInput(['maxlength' => 255]);
    $tabProfile .= $form->field($model, 'email')->textInput(['maxlength' => 255]);
    $tabProfile .= '</div>';
    $tabProfile .= '</div>';

    $tabRegistration = '';
    $tabRegistration .= '<div class="row">';
    $tabRegistration .= '<div class="col-lg-12" id="update-registration">';
    $tabRegistration .= '<div class="col-md-6">';
    $tabRegistration .= '<div class="title">Main Registrant</div>';
    $tabRegistration .= '<div class="boxed">';
    $tabRegistration .= '<div class="col-md-6">';
    $tabRegistration .= $form->field($model, 'reg_city')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'reg_phone')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'reg_fb')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'reg_email')->textInput(['maxlength' => true]);
    $tabRegistration .= '</div>';
    $tabRegistration .= '<div class="col-md-6">';
    $tabRegistration .= $form->field($model, 'reg_country')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'nationality')->textInput(['maxlength' => 255]);
    $tabRegistration .= $form->field($model, 'reg_whats_up')->widget(SwitchInput::classname(), []);
    $tabRegistration .= $form->field($model, 'reg_role')->dropDownList(['FOLLOWER' => 'FOLLOWER', 'LEADER' => 'LEADER'],['prompt'=>'Select Option']);
    $tabRegistration .= '</div>';
    $tabRegistration .= '</div>';
    $tabRegistration .= '</div>';
    $tabRegistration .= '<div class="col-md-6">';
    $tabRegistration .= '<div class="title">Dance Partner</div>';
    $tabRegistration .= '<div class="boxed">';
    $tabRegistration .= '<div class="col-md-6">';
    $tabRegistration .= $form->field($model, 'first_name_partner')->textInput(['maxlength' => 255]);
    $tabRegistration .= $form->field($model, 'reg_city_partner')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'reg_email_partner')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'reg_phone_partner')->textInput(['maxlength' => true]);
    $tabRegistration .= '</div>';
    $tabRegistration .= '<div class="col-md-6">';
    $tabRegistration .= $form->field($model, 'last_name_partner')->textInput(['maxlength' => 255]);
    $tabRegistration .= $form->field($model, 'reg_country_partner')->textInput(['maxlength' => true]);
    $tabRegistration .= $form->field($model, 'nationality_partner')->textInput(['maxlength' => 255]);
    $tabRegistration .= $form->field($model, 'reg_fb_partner')->textInput(['maxlength' => true]);
    $tabRegistration .= '</div>';
    $tabRegistration .= '</div>';
    $tabRegistration .= '</div>';
    $tabRegistration .= '<div class="col-lg-12">';
    $tabRegistration .= $form->field($model, 'notes')->widget(
        \yii\imperavi\Widget::className(), [
            'plugins' => ['fullscreen', 'fontcolor'],
            'options' => [
                'minHeight' => 200,
                'maxHeight' => 200,
                'buttonSource' => true,
                'convertDivs' => false,
                'removeEmptyTags' => false,
                'imageUpload' => Yii::$app->urlManager->createUrl(['/file-storage/upload-imperavi'])
            ]
        ]
    );
    $tabRegistration .= '</div>';
    $tabRegistration .= '</div>';
    $tabRegistration .= '</div>';



    $tabAddress = '';
    $tabAddress .= '<div class="row">';
    $tabAddress .= '<div class="col-lg-12" id="update-address">';
    $tabAddress .= '<div class="col-md-6">';
    $tabAddress .= $form->field($model, 'address_1')->textInput();
    $tabAddress .= $form->field($model, 'address_2')->textInput();
    $tabAddress .= $form->field($model, 'city')->textInput(['maxlength' => true]);
    $tabAddress .= $form->field($model, 'state')->textInput(['maxlength' => true]);
    $tabAddress .= '</div>';
    $tabAddress .= '<div class="col-md-6">';
    $tabAddress .= $form->field($model, 'country')->textInput();
    $tabAddress .= $form->field($model, 'postal_code')->textInput(['maxlength' => true]);
    $tabAddress .= $form->field($model, 'phone')->textInput();
    $tabAddress .= '</div>';
    $tabAddress .= '</div>';
    $tabAddress .= '</div>';



    $tabTicket = '';
    $tabTicket .= '<div class="row">';
    $tabTicket .= '<div class="col-lg-12" id="update-categories">';
    $tabTicket .= '<div class="col-md-4">';
    $tabTicket .= $form->field($model, 'order_id')->textInput();
    $tabTicket .= $form->field($model, 'registration_id')->textInput();
    $tabTicket .= $form->field($model, 'registration_time')->textInput();
    $tabTicket .= $form->field($model, 'registration_code')->textInput(['maxlength' => true]);
    $tabTicket .= $form->field($model, 'registration_status')->textInput(['maxlength' => true]);
    $tabTicket .= '</div>';
    $tabTicket .= '<div class="col-md-4">';
    $tabTicket .= $form->field($model, 'ticket_name')->textInput(['maxlength' => 255]);
    $tabTicket .= $form->field($model, 'transaction_id')->textInput();
    $tabTicket .= $form->field($model, 'transaction_status')->textInput(['maxlength' => true]);
    //$tabTicket .= $form->field($model, 'transaction_amount')->textInput();
    $tabTicket .= '</div>';
    $tabTicket .= '<div class="col-md-4">';
    $tabTicket .= $form->field($model, 'amount_paid')->textInput();
    $tabTicket .= $form->field($model, 'payment_date')->textInput();
    $tabTicket .= $form->field($model, 'payment_method')->textInput(['maxlength' => true]);
    $tabTicket .= $form->field($model, 'geteway_transaction')->textInput(['maxlength' => true]);
    $tabTicket .= '</div>';
    $tabTicket .= '</div>';
    $tabTicket .= '</div>';

    $items = [
        [
            'label' => '<i class="fa fa-user-circle"></i> Ticket Owner',
            'content' => $tabProfile,
        ],
        [
            'label' => '<i class="fa fa-wpforms"></i> Registration Form',
            'content' => $tabRegistration,
        ],
        [
            'label' => '<i class="fa fa-shopping-cart"></i> Ticket Details',
            'content' => $tabTicket,
        ],
        [
            'label' => '<i class="fa fa-address-card-o"></i> Payment Address',
            'content' => $tabAddress,
        ],
    ];

// Show tabs
    echo TabsX::widget([
        'enableStickyTabs' => true,
        'items' => $items,
        'position' => TabsX::POS_ABOVE,
        'bordered' => true,
        'encodeLabels' => false,
        'containerOptions' => ['background-color' => 'black']
    ]);
    ?>
    <div class="form-group">
        <?= Html::a('Cancel and Close', ['ticket/index'], ['class' => 'btn btn-warning']) ?>
        <?= Html::submitButton($model->isNewRecord ? 'Confirm Entry and Close' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-success']) ?>
    </div>
   

    <?php ActiveForm::end(); ?>

</div>

