<?php

use yii\helpers\Html;
use yii\helpers\Url;

/* @var $this \yii\web\View */
/* @var $model \yii2mod\comments\models\CommentModel */
/* @var $maxLevel null|integer comments max level */

$urlViewProfile = Yii::$app->urlManager->createUrl('user/default/viewmodal?id=' . $model->createdBy);

//echo print_r($model);

?>
<li class="comment" id="comment-<?php echo $model->id; ?>">
    <div class="comment-content" data-comment-content-id="<?php echo $model->id ?>">
        <div class="comment-author-avatar">
            <?=
            Html::button(Html::img($model->getAvatar(), 
                                ['alt' => $model->getAuthorName()]), [
                        'value' => $urlViewProfile,
                        'class' => 'viewProfileInfo',
                        'data-target' => '#modal-profile',
                        ]);

            ?>
        </div>
        <div class="comment-details">
            <div class="comment-action-buttons">
<?php if (Yii::$app->getUser()->can('manager')) : ?>
                    <?php echo Html::a('<span class="glyphicon glyphicon-trash"></span> ' . Yii::t('yii2mod.comments', 'Delete'), '#', ['data' => ['action' => 'delete', 'url' => Url::to(['/comment/default/delete', 'id' => $model->id]), 'comment-id' => $model->id]]); ?>
                <?php endif; ?>
                <?php if (!Yii::$app->user->isGuest && ($model->level < $maxLevel || is_null($maxLevel))) : ?>
                    <?php echo Html::a("<span class='glyphicon glyphicon-share-alt'></span> " . Yii::t('yii2mod.comments', 'Reply'), '#', ['class' => 'comment-reply', 'data' => ['action' => 'reply', 'comment-id' => $model->id]]); ?>
                <?php endif; ?>
            </div>
            <div class="comment-author-name">
                <span><?php echo $model->getAuthorName(); ?></span>
<?php echo Html::a($model->getPostedDate(), $model->getAnchorUrl(), ['class' => 'comment-date']); ?>
            </div>
            <div class="comment-body">
<?php echo $model->getContent(); ?>
            </div>
        </div>
    </div>
</li>
<?php if ($model->hasChildren()) : ?>
    <ul class="children">
    <?php foreach ($model->getChildren() as $children) : ?>
            <li class="comment" id="comment-<?php echo $children->id; ?>">
            <?php echo $this->render('_list', ['model' => $children, 'maxLevel' => $maxLevel]) ?>
            </li>
            <?php endforeach; ?>
    </ul>
    <?php endif; ?>
