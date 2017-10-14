<?php
/**
 * @var $this yii\web\View
 * @var $model common\models\Book
 */
use yii\helpers\Html;

?>
<hr/>
<div class="book-item row">
    <div class="col-xs-12">
        <h2 class="book-title">
            <?php echo Html::a($model->title, ['view', 'slug'=>$model->slug]) ?>
        </h2>
        <div class="book-meta">
            <span class="book-date">
                <?php echo Yii::$app->formatter->asDatetime($model->created_at) ?>
            </span>,
            <span class="book-category">
                <?php echo Html::a(
                    $model->category->title,
                    ['index', 'BookSearch[category_id]' => $model->category_id]
                )?>
            </span>
        </div>
        <div class="book-content">
            <?php if ($model->thumbnail_path): ?>
                <?php echo Html::img(
                    Yii::$app->glide->createSignedUrl([
                        'glide/index',
                        'path' => $model->thumbnail_path,
                        'w' => 100
                    ], true),
                    ['class' => 'book-thumb img-rounded pull-left']
                ) ?>
            <?php endif; ?>
            <div class="book-text">
                <?php echo \yii\helpers\StringHelper::truncate($model->body, 150, '...', null, true) ?>
            </div>
        </div>
    </div>
</div>
