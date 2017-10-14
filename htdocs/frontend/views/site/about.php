<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use \common\widgets\DbText;

$this->title = 'About us';
?>

<div class="site-about clients">
    <div class="container about">
        <div class="row">
            <div class="col-xm-12 col-md-7">
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
            <div class="col-xm-12 col-md-5">
                <div id="about-side-wraper">
                    <h3>Partners</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=6')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-partners']); ?>
                    <br>
                    <h3>Team</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=7')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-team']); ?>
                    <br>
                    <h3>Readers</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=12')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-readers']); ?>
                    <br>
                    <h3>Home</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=9')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-home']); ?>               

                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-7">
                <div id="about-side-wraper">
                    <h3>Publishing Family</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=10')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-publishing-family']); ?>               
                </div>
            </div>
            <div class="col-sm-12 col-md-5">
                <div id="about-side-wraper">
                    <h3>Agencies</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=11')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-agencies']); ?> 
                    <br>
                    <h3>Media Family</h3>
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=13')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?= DbText::widget(['key' => 'about-us-media-family']); ?> 
                </div>
            </div>
        </div>    
    </div>
</div>


