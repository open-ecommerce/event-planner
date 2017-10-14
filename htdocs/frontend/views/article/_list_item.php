<?php

// YOUR_APP/views/list/_list_item.php

use yii\helpers\Html;

$newsImagePath = (empty($model->thumbnail_path) ? $model->category->thumbnail_path : $model->thumbnail_path);
?>


<article class="list-item col-sm-12 col-md-6" data-key="<?= $model['id'] ?>">
    <figure>
        <?php
        if (Yii::$app->user->can("administrator")) {
            $urlPost = Yii::$app->urlManager->createUrl(array('/admin/article/update?id=' . $model->id));
            echo '<a id="toolbar-edit" class="btn btn-md btn-success glyphicon glyphicon-pencil" href="' . $urlPost . '" alt="Edit in backend" target="_blank" title="Edit in backend"></a>';
        }
        $articleUrl = "/article/" . $model->slug;
        echo Html::a(\yii\helpers\Html::img(
                        Yii::$app->glide->createSignedUrl([
                            'glide/index',
                            'path' => $newsImagePath,
                            'w' => '100%'
                                ], true), ['class' => 'article-image']
                ), $articleUrl);
        ?>           
    </figure>
    <div class="td-post-category"><?= $model->category->title ?></div>
    <h3 class="title"><?= Html::a(Html::encode($model['title']), $articleUrl); ?></h3>
    <div class="meta-info">
        <span class="author">by <?= Html::encode($model->author->fullname); ?></span> - <span class="posted"><?= Yii::$app->formatter->asDate($model->updated_at, 'dd MMM yyyy'); ?></span>   
    </div>
</article>