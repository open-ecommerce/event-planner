<?php

// YOUR_APP/views/list/_list_item.php

use yii\helpers\Html;

$newsImagePath = (empty($model->thumbnail_path) ? $model->category->thumbnail_path : $model->thumbnail_path);
?>

<article class="list-item col-sm-12" data-key="<?= $model['id'] ?>">
    <div class="col-md-4">
        <figure>
            <?php
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
    </div>        
    <div class="col-md-8">
        <h3 class="title popular"><?= Html::a(Html::encode($model['title']), $articleUrl); ?></h3>        
        <div class="meta-info popular">
            <span class="author">by <?= Html::encode($model->author->fullname); ?></span> - <span class="posted"><?= Yii::$app->formatter->asDate($model->updated_at, 'dd MMM yyyy'); ?></span>   
        </div>
    </div>
</article>