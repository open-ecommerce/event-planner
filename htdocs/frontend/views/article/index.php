<?php

// YOUR_APP/views/list/index.php

use yii\widgets\ListView;
use yii\helpers\Html;
use yii\helpers\Url;
use common\models\Article;
use yii\helpers\ArrayHelper;

$this->title = "Shouts and Murmurs";
?>
    <?php
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '',
        'id' => 'toolbar-bookmark',
        'alt' => 'Grid View',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-th-large active'];
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '/shouts/index',
        'id' => 'toolbar-bookmark',
        'alt' => 'List View',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-th-list inactive'];
    ?>    
<div id="article-index" class="row">
    <h1>Shouts and Murmurs</h1>

    <div class="row">
        <div id="main" class="col-sm-8 col-md-8">


            <?=
            ListView::widget([
                'options' => [
                    'tag' => 'div',
                ],
                'dataProvider' => $listDataProvider,
                'itemView' => function ($model, $key, $index, $widget) {
                    $itemContent = $this->render('_list_item', ['model' => $model]);
                    return $itemContent;
                },
                'itemOptions' => [
                    'tag' => false,
                ],
                'summary' => '',
                /* do not display {summary} */
                'layout' => '{items}{pager}',
                'pager' => [
                    'firstPageLabel' => 'First',
                    'lastPageLabel' => 'Last',
                    'maxButtonCount' => 4,
                    'options' => [
                        'class' => 'pagination col-xs-12'
                    ]
                ],
            ]);
            ?>
        </div>
        <div id="popular" class="col-sm-4 col-md-4">
            <div class="td-block-title-wrap">
                <h4 class="block-title">
                    <span class="td-pulldown-size">MOST POPULAR</span>
                </h4>
            </div>            
            <?=
            ListView::widget([
                'options' => [
                    'tag' => 'div',
                ],
                'dataProvider' => $listDataProvider,
                'itemView' => function ($model, $key, $index, $widget) {
                    $itemContent = $this->render('_list_item_popular', ['model' => $model]);

                    return $itemContent;

                    /* Or if you just want to display the list item only: */
                    // return $this->render('_list_item',['model' => $model]);
                },
                'itemOptions' => [
                    'tag' => false,
                ],
                'summary' => '',
                /* do not display {summary} */
                'layout' => '{items}',
                'pager' => [
                    'firstPageLabel' => 'First',
                    'lastPageLabel' => 'Last',
                    'maxButtonCount' => 4,
                    'options' => [
                        'class' => 'pagination col-xs-12'
                    ]
                ],
            ]);
            ?>
        </div>
    </div>
</div>
