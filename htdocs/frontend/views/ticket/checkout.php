<?php

//cases 

use kartik\daterange\DateRangePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\editable\Editable;
use yii\helpers\Url;
use common\models\UserProfile;
use common\models\User;
use yii\helpers\ArrayHelper;
use common\models\TicketType;
use common\models\Ticket;
use common\grid\EnumColumn;
use kartik\form\ActiveForm;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider
 */


$this->title = "  Checkout - Exiting the venue";
?>

    <div id="book-index-desktop" class="col-md-4">
        <div id="barcode-search">
            <?php
            $form = ActiveForm::begin([
                'action' => ['checkout'],
                'method' => 'get',
            ]);
            echo $form->field($searchModel, 'barcodeSearch', [
                'addon' => [
                    'prepend' => [
                        'content' => '<i class="glyphicon glyphicon-credit-card"></i>'
                    ],
                    'append' => [
                        'content' => Html::submitButton(Yii::t('backend', '<i class="glyphicon glyphicon-log-out"></i>'), ['class' => 'btn btn-view']),
                        'asButton' => true
                    ]
                ]
            ])->textInput()->input('barcodeSearch', ['placeholder' => "Check Out"])->label(false);

            ?>

            <?php ActiveForm::end(); ?>
            <div id="current-day">Event day: <?php echo Yii::$app->keyStorage->get('frontend.current-day') ?> <?= Html::a('(change in settings)', ['/admin/key-storage/update?id=frontend.current-day']) ?></div>
        </div>
    </div>
<?php

$this->registerJs("
window.onload = function() {
  var input = document.getElementById('ticketsearch-barcodesearch').focus();
  $('#ticketsearch-barcodesearch').attr('value', '');  
}
");
?>