<?php

use yii\helpers\Html;
use yii\web\View;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;
use tikaraj21\newsletter\models\EmailTemplates;
use tikaraj21\newsletter\models\Group;
use tikaraj21\newsletter\models\SavedEmailTemplates;
use marqu3s\summernote\Summernote;

/* @var $this yii\web\View */
/* @var $model app\models\Equeue */
/* @var $form yii\widgets\ActiveForm */
/* @var $draftName string */

?>
<div class="main-form" style="margin-top: 10px">
    <!-- quick email widget -->
    <div class="box box-info">
        <div class="box-header" style="border-bottom: 1px solid #00c0ef">
            <i class="fa fa-envelope" style="padding: 10px 0px 10px 10px;"></i>
            <h3 class="box-title"><?= Html::encode($this->title) ?></h3>

        </div>
        <div class="box-body">
            <?php $form = ActiveForm::begin(['id' => $model->formName(), 'options' => ['enctype' => 'multipart/form-data']]); ?>
            <div class="row">
                <div class="col-sm-2">
                    <?=
                    $form->field($model, 'to_group')->dropDownList(
                            ['999' => 'All Users in the System'] + ArrayHelper::map(Group::find()->select(['group_id', 'group_name'])->orderBy('group_name')->all(), 'group_id', 'group_name'), ['prompt' => 'Select Group'])
                    ?>    
                </div>
                <div class="col-sm-10">
                    <?= $form->field($model, 'to')->textInput(['placeholder' => 'Only comma separated emails']) ?>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-2">
                    <?=
                    $form->field($model, 'cc_group')->dropDownList(
                            ['999' => 'All Users in the System'] + ArrayHelper::map(Group::find()->select(['group_id', 'group_name'])->orderBy('group_name')->all(), 'group_id', 'group_name'), ['prompt' => 'Select Group'])
                    ?>
                </div>
                <div class="col-sm-10">
                    <?= $form->field($model, 'cc')->textInput(['placeholder' => 'Only comma separated emails']) ?>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-2">
                    <?=
                    $form->field($model, 'bcc_group')->dropDownList(
                            ['999' => 'All Users in the System'] + ArrayHelper::map(Group::find()->select(['group_id', 'group_name'])->orderBy('group_name')->all(), 'group_id', 'group_name'), ['prompt' => 'Select Group'])
                    ?>    
                </div>
                <div class="col-sm-10">
                    <?= $form->field($model, 'bcc')->textInput(['placeholder' => 'Only comma separated emails']) ?>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-2">
                    <?=
                    $form->field($model, 'templates')->dropDownList(
                            ArrayHelper::map(EmailTemplates::find()->select(['template_id', 'template_name'])->orderBy('template_name')->all(), 'template_id', 'template_name'), ['prompt' => 'Select Template']
                    )
                    ?>
                </div>
                <div class="col-sm-10">
                    <?= $form->field($model, 'subject')->textInput(['maxlength' => true, 'placeholder' => 'Subject']) ?>
                </div>
            </div>
            <?=
            $form->field($model, 'text_body')->widget(Summernote::className(), [
                    'clientOptions' => [
                        'id' => 'emails',
                        'toolbar' => [
                            ['undo', ['undo']],
                            ['redo', ['redo']],
                            ['insert', ['link', 'hr']],
                            ['style', ['bold', 'italic', 'underline', 'clear']],
                            ['font', ['strikethrough', 'superscript', 'subscript']],
                            ['fontsize', ['fontsize']],
                            ['color', ['color']],
                            ['para', ['ul', 'ol', 'paragraph']],
                            ['height', ['height']],
                            ['view', ['codeview']],
                            ['help', ['help']],
                        ],
                        'height' => 400,
//                        'disableDragAndDrop' => true,
                        'callbacks' => [
                            'onImageUpload' => 'function(files) {
                                uploadImage(files[0]);
                            }',
                        ],
                    ],
                ]
            );
            ?>                    

            <?php
//            $form->field($model, 'savedtemplates')->dropDownList(
//                    ArrayHelper::map(SavedEmailTemplates::find()->select(['template_id', 'template_name'])->orderBy('template_name')->all(), 'template_id', 'template_name'), ['prompt' => 'Select Saved Template']
//            )
            ?>
            <?= $form->field($model, 'attachment[]')->fileInput(['multiple' => TRUE]) ?>


            <div class="form-group">
                <?= Html::submitButton('Create', ['class' => 'btn btn-success']) ?>
            </div>

            <div class="form-group">
                <label class="control-label" for="draft_name">Draft name</label>
                <input type="text" id="draft_name" class="form-control" name="Draft[name]" placeholder="Draft name" aria-required="true" value="<?= $draftName ?>">
                <div class="help-block"></div>
                <?= Html::a('Save draft', ['/newsletter-draft/save'], [
                    'id' => 'save_draft_btn',
                    'class' => 'btn btn-info',
                    'data-form_id' => $model->formName(),
                ]); ?>
            </div>

            <?php ActiveForm::end(); ?>
        </div>
        <div class="box-footer clearfix">
<!--                                    <button class="pull-right btn btn-default" id="sendEmail">Send <i class="fa fa-arrow-circle-right"></i></button>-->
        </div>
    </div>


</div>

<?php $this->registerJsFile('/admin/js/newsletter.js', ['position' => View::POS_END, 'depends' => [yii\web\JqueryAsset::className()]]) ?>

