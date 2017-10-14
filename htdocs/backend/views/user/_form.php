
<?php

use common\models\User;
use common\models\Company;
use yii\helpers\Url;
use kartik\helpers\Html;
use yii\bootstrap\ActiveForm;
use jlorente\remainingcharacters\RemainingCharacters;
use kartik\checkbox\CheckboxX;
use dosamigos\selectize\SelectizeTextInput;
use dosamigos\selectize\SelectizeDropDownList;
use kartik\tabs\TabsX;
use kartik\tree\TreeViewInput;
use common\models\BookCategoryTree;
use kartik\grid\GridView;
use common\grid\EnumColumn;
use yii\bootstrap\Modal;
use marqu3s\summernote\Summernote;
use yii\web\JsExpression;
use kartik\dialog\Dialog;
use kartik\detail\DetailView;
use kartik\widgets\SwitchInput;
use branchonline\joyride\Joyride;
use trntv\filekit\widget\Upload;

/**
 * @var yii\web\View $this
 * @var common\models\Company $model
 * @var yii\widgets\ActiveForm $form
 */
?>



<?php //echo Html::submitButton(Yii::t('backend', 'Save'), ['class' => 'btn btn-primary', 'name' => 'signup-button']) ?>


<div class="user-form">
    <?php $form = ActiveForm::begin(); ?>

    <?= $form->errorSummary($model, ['header' => '<h3>Ops Looks like there are some empty requred fields.</h3>']); ?>

    <?php
    echo '<button type="button" id="btn-cancel-no-save" class="btn btn-danger pull-right"><i class="fa fa-close"></i> Cancel Without Save</button>';

    //$account = $model;


    echo Html::submitButton(
            $model->isNewRecord ? '<i class="fa fa-save"></i> ' . Yii::t('backend', ' Create and Close') : '<i class="fa fa-save"></i> ' . Yii::t('backend', 'Save & Close'), ['class' => $model->isNewRecord ? 'btn btn-success book-update-top' : 'btn btn-success book-update-top']);

    $tabUser = '';
    $tabUser .= '<div class="row">';
    $tabUser .= '<div class="col-lg-6">';
    $tabUser .= $form->field($model, 'email')->textInput(['maxlength' => true]);
    $tabUser .= $form->field($model, 'username')->textInput(['maxlength' => true]);
    $tabUser .= $form->field($model, 'password')->passwordInput();
    $tabUser .= '</div>';
    $tabUser .= '<div class="col-lg-6">';
    $tabUser .= '<div class="col-lg-3">';
    $tabUser .= $form->field($model, 'status')->dropDownList(User::statuses());
    $tabUser .= $form->field($model, 'roles')->checkboxList($roles);
    $tabUser .= '</div>';
    $tabUser .= '<div class="col-lg-3">';
    $tabUser .= '</div>';
    $tabUser .= '</div>';
    $tabUser .= '</div>';

    $tabProfile = '';
    $tabProfile .= '<div class="row" id="update-profile">';
    $tabProfile .= '<div class="col-md-6" id="wrap-main">';
    $tabProfile .= '<div class="col-md-4">';
    $tabProfile .= $form->field($profileModel, 'picture')->widget(
            Upload::classname(), [
        'url' => ['avatar-upload'],
        'maxFileSize' => 5 * 1024 * 1024, // 10 MiB            
            ]
    );
    $tabProfile .= '</div>';

    $tabProfile .= '<div class="col-md-8">';
    $tabProfile .= $form->field($profileModel, 'publishing_house_id')->dropDownList(\yii\helpers\ArrayHelper::map(Company::find()
                            ->orderBy('name')
                            ->all(), 'id', 'name'
            ), ['prompt' => 'Select the company that this user belongs']);

    $tabProfile .= '<div class="row">'; //start fiction nofiction
    $tabProfile .= '<div class="col-lg-6">'; //start visible clients
    $tabProfile .= $form->field($profileModel, 'fiction')->widget(SwitchInput::classname(), [
        'name' => 'fiction',
        'value' => false,
        'pluginOptions' => [
            'onText' => 'Yes',
            'offText' => 'No',
        ]
    ]);
    $tabProfile .= '</div>'; //end fiction
    $tabProfile .= '<div class="col-lg-6">'; //start visible for all clients
    $tabProfile .= $form->field($profileModel, 'non_fiction')->widget(SwitchInput::classname(), [
        'name' => 'non_fiction',
        'value' => false,
        'pluginOptions' => [
            'onText' => 'Yes',
            'offText' => 'No',
        ]
    ]);
    $tabProfile .= '</div>'; //end visible all clients
    $tabProfile .= '</div>'; //end visible fiction no fiction


    $tabProfile .= $form->field($profileModel, 'firstname')->textInput(['maxlength' => 255]);
    $tabProfile .= $form->field($profileModel, 'lastname')->textInput(['maxlength' => 255]);
    $tabProfile .= $form->field($profileModel, 'job_title')->textInput(['maxlength' => 255]);
    $tabProfile .= '</div>';
    $tabProfile .= $form->field($profileModel, 'about')->widget(Summernote::className(), [
        'clientOptions' => [
            'id' => 'notes-summernote',
            'height' => 250,
            'toolbar' => [
                ['undo', ['undo']],
                ['redo', ['redo']],
                ['view', ['codeview']],
            ]
        ],
            ]
    );

    $tabProfile .= '</div>';
    $tabProfile .= '<div class="col-md-6" id="wrap-detail">';
    $tabProfile .= '<div class="form-group field-tags">';
    $tabProfile .= $form->field($profileModel, 'langNames')->widget(SelectizeTextInput::className(), [
        'loadUrl' => ['/language/list'],
        'options' => ['class' => 'form-control tags'],
        'clientOptions' => [
            'plugins' => ['remove_button'],
            'valueField' => 'name',
            'labelField' => 'name',
            'searchField' => ['name'],
            'autosearch' => ['on'],
            'create' => FALSE,
        ],
    ]);
    $tabProfile .= '</div>';
    $tabProfile .= '<div class="form-group field-tags">';
    $tabProfile .= $form->field($profileModel, 'langiNames')->widget(SelectizeTextInput::className(), [
        'loadUrl' => ['/language/list'],
        'options' => ['class' => 'form-control tags'],
        'clientOptions' => [
            'plugins' => ['remove_button'],
            'valueField' => 'name',
            'labelField' => 'name',
            'searchField' => ['name'],
            'autosearch' => ['on'],
            'create' => FALSE,
        ],
    ]);
    $tabProfile .= '</div>';


    $tabProfile .= $form->field($profileModel, 'books_published')->widget(Summernote::className(), [
        'clientOptions' => [
            'id' => 'notes-summernote',
            'height' => 150,
            'toolbar' => [
                ['undo', ['undo']],
                ['redo', ['redo']],
                ['view', ['codeview']],
            ]
        ],
            ]
    );

    $tabProfile .= $form->field($profileModel, 'wished_you_published')->widget(Summernote::className(), [
        'clientOptions' => [
            'id' => 'notes-summernote',
            'height' => 150,
            'toolbar' => [
                ['undo', ['undo']],
                ['redo', ['redo']],
                ['view', ['codeview']],
            ]
        ],
            ]
    );
    $tabProfile .= '</div>';
    $tabProfile .= '</div>';


    $tabCategories = '';
    $tabCategories .= '<div class="row">';
    $tabCategories .= '<div class="col-lg-12" id="update-categories">';

    $allowCategories = explode(',', $profileModel->AllowedCategories);
    $tabCategories .= '<label class="control-label">Favorites categories</label>';
    $tabCategories .= TreeViewInput::widget([
                'query' => BookCategoryTree::find()->where(['id' => $allowCategories])->addOrderBy('root, lft'),
                'headingOptions' => ['label' => 'Categories'],
                'model' => $profileModel,
                'id' => 'other-category',
                'attribute' => 'categories_tree',
                //'name' => 'categories_tree', // input name
                'value' => 'true', // values selected (comma separated for multiple select)
                'asDropdown' => false, // will render the tree input widget as a dropdown.
                'autoCloseOnSelect' => false,
                'fontAwesome' => true,
                'multiple' => true, // set to false if you do not need multiple selection
                'fontAwesome' => true, // render font awesome icons
                'rootOptions' => ['label' => '<i class="fa fa-tree text-success"></i>'],
//                'rootOptions' => [
//                    'label' => '', // custom root label
//                    'class' => 'hide'
//                ],
                'options' => ['disabled' => false],
    ]);
    $tabCategories .= '</div>';
    $tabCategories .= '</div>';

    $items = [
        [
            'label' => '<i class="fa fa-key"></i> Credentials',
            'content' => $tabUser,
            'active' => true,
        ],
        [
            'label' => '<i class="fa fa-vcard"></i> Profile',
            'content' => $tabProfile,
        ],
        [
            'label' => '<i class="fa fa-check-square-o"></i> User Categories',
            'content' => $tabCategories,
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



    <?php ActiveForm::end(); ?>

</div>

<?php
$script = <<< JS
    $("#btn-cancel-no-save").on("click", function () {
        krajeeDialog.confirm("Are you sure you want close without saving?", function (result) {
            if (result) {
                var url = '/admin/user/index';
                window.open(url, '_self');
            }
        });
    });
JS;
$this->registerJs($script);
?>
