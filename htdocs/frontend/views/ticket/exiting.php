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

$deleteTip = "Delete this client detail and all the attendances records.";
$deleteMsg = "Are you sure you want to delete this client detail and all the attendances records?";


$this->title = "  Exiting the hall";
?>

    <div id="book-index-desktop" class="col-md-2">
        <div id="barcode-search">
            <?php
            $form = ActiveForm::begin([
                'action' => ['exiting'],
                'method' => 'get',
            ]);
            echo $form->field($searchModel, 'barcodeSearch', [
                'addon' => [
                    'prepend' => [
                        'content' => '<i class="glyphicon glyphicon-credit-card"></i>'
                    ],
                    'append' => [
                        'content' => Html::submitButton(Yii::t('backend', '<i class="glyphicon glyphicon-road"></i>'), ['class' => 'btn btn-view']),
                        'asButton' => true
                    ]
                ]
            ])->textInput()->input('barcodeSearch', ['placeholder' => "Check Out"])->label(false);

            ?>

            <?php ActiveForm::end(); ?>
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