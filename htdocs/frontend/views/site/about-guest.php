<?php
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use \common\widgets\DbText;


$this->title = 'About us';
?>
<div class="site-about clients">
    <div class="container about">
        <div class="row">
            <div class="col-xm-12 col-md-12">
                <div id="about-main-wraper">
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=4')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-main']); ?>
                </div>
            </div>
        </div>
    </div>    
</div>

