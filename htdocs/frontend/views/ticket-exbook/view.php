<?php
/* @var $this yii\web\View */
/* @var $model common\models\Book */

//(isset($model->recommendation->recommendation) ? $model->recommendation->recommendation : false);


use yii\web\JsExpression;
use yii\helpers\Html;
use yeesoft\comments\widgets\Comments;
use common\helpers\OeHelpers;
use common\models\Bookmark;
use yii\helpers\BaseStringHelper;
use kartik\widgets\StarRating;
use yii\widgets\Pjax;
use kartik\tree\TreeView;
use common\models\BookCategoryTree;
use kartik\grid\GridView;
use yii\bootstrap\Collapse;

$this->title = $model->title;
$this->params['breadcrumbs'][] = ['label' => Yii::t('frontend', 'Books'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;

$emailSubjectLink = "Hello%20from LLS...";
?>

<div id="flash-message"></div>

<div id="book-detail">

    <?php
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '#',
        'id' => 'toolbar-bookmark',
        'alt' => 'Bookmark this book',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-bookmark' . $model->bookmarked];
    $this->params['toptoolbar'][] = [
        'label' => '',
        'id' => 'toolbar-favorite',
        'url' => '#',
        'alt' => 'Add to your favorites',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-asterisk' . $model->favorited];
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '#',
        'id' => 'toolbar-email',
        'alt' => 'Send by mail',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-envelope'];
    if (Yii::$app->user->can("administrator")) {
        $url = Yii::$app->urlManager->createUrl(array('/admin/book/update?id=' . $model->id));
        $this->params['toptoolbar'][] = [
            'label' => '',
            'id' => 'toolbar-edit',
            'url' => $url,
            'alt' => 'Edit in backend',
            'target' => '_blank',
            'class' => 'btn btn-md btn-success glyphicon glyphicon-pencil'];
    };
    ?>
    <div class="row" id="wrap-book">
        <div class="col-md-9">
            <div id="main" class="row">
                <div class="col-xs-3 col-lg-2">
                    <div class="cover">
                        <?php
                        if (!empty($model->manuscript_path)) {
                            $manuscriptTitle = 'Download manuscript (' . Yii::$app->formatter->asSize($model->manuscript_size) . ')';
                            echo '<a href="/book/attachment-download?path=' . $model->manuscript_path . '&name=' . $model->manuscript_name . '" data-placement="top" data-original-title="' . $model->manuscript_path . '" title="' . $manuscriptTitle . '">';
                        }
                        ?>
                        <?php if ($model->thumbnail_path): ?>
                            <?php
                            echo \yii\helpers\Html::img(
                                    Yii::$app->glide->createSignedUrl([
                                        'glide/index',
                                        'path' => $model->thumbnail_path,
                                        'w' => 90
                                            ], true), ['class' => 'book-thumb img-rounded pull-left']
                            )
                            ?>
                        <?php else: ?>
                            <img src="/dist/img/generic/no-cover.jpg">
                        <?php endif; ?>
                        <?php
                        if (!empty($model->manuscript_path)) {
                            echo '</a>';
                        }
                        ?>

                    </div>
                </div>
                <div class="col-xs-9 col-lg-10">
                    <div class="row">
                        <div class="category"><?= (isset($model->category->name) ? $model->category->name : false); ?></div>
                        <?= (!empty($model->otherCategories) ? '<div class="category other-category">' . $model->otherCategories . '</div>' : false); ?>
                    </div>
                    <div class="title"><?= $model->title; ?></div>
                    <div class="author"><?= $model->author->name; ?></div>

                    <div class="submission <?= ($model->official_submission === 0 ? "non-official" : "official"); ?>">
                        <span class="glyphicon glyphicon-flag"></span>
                        <?= $model->submission; ?>
                    </div>
                    <div class="last-update">
                        <span class="glyphicon glyphicon-pencil"></span>
                        <?= 'Last report update: ' . \Yii::$app->formatter->asDatetime($model->updated_at, "php:d-m-Y h:i") ?>
                    </div>


                </div>

            </div>
            <div class="devider"></div>       


            <div id="book-rights" class="row">
                <div class="col-lg-12">                
                    <div class="col-lg-5">
                        <?php if (!empty($model->publisher->name)): ?>
                            <div class="publisher content-wrapper">
                                <?php $emailTo = (!empty($model->publisher->email) ? Html::a('<i class="glyphicon glyphicon-envelope"></i>', null, ['href' => 'mailto:' . $model->publisher->email . '?Subject=' . $emailSubjectLink, 'target' => '_blank']) : ""); ?>
                                <div class="title">Publishing House</div>
                                <div class="content"><?= (isset($model->publisher->name) ? $model->publisher->name : false); ?></div>
                                <div class="content icon"><?= $model->publisher->email . $emailTo ?> </div>
                            </div>
                        <?php endif; ?>
                        <?php if (!empty($model->rightsOwner->name)): ?>
                            <?php $emailTo = (!empty($model->rightsOwner->email) ? Html::a('<i class="glyphicon glyphicon-envelope"></i>', null, ['href' => 'mailto:' . $model->rightsOwner->email . '?Subject=' . $emailSubjectLink, 'target' => '_blank']) : ""); ?>
                            <div class="rights content-wrapper">
                                <div class="title">Rights Owner</div>
                                <div class="content"><?= (isset($model->rightsOwner->name) ? $model->rightsOwner->name : false); ?></div>
                                <div class="content icon"><?= $model->rightsOwner->email . $emailTo ?> </div>
                            </div>
                        <?php endif; ?>
                        <?php if (!empty($model->primaryAgent->name)): ?>
                            <?php $emailTo = (!empty($model->primaryAgent->email) ? Html::a('<i class="glyphicon glyphicon-envelope"></i>', null, ['href' => 'mailto:' . $model->primaryAgent->email . '?Subject=' . $emailSubjectLink, 'target' => '_blank']) : ""); ?>
                            <div class="primary-agent content-wrapper">
                                <div class="title">Primary Agent</div>
                                <div class="content"><?= (isset($model->primaryAgent->name) ? $model->primaryAgent->name : false); ?></div>
                                <div class="content icon"><?= $model->primaryAgent->email . $emailTo ?> </div>
                            </div>
                        <?php endif; ?>
                    </div>                
                    <div class="col-lg-7">
                        <div class="row">
                            <div id="latest-deals">
                                <div class="mydeal"><?= $model->getUserDeal() ?></div>
                                <?php if (!empty($model->rightsOwner->name)): ?>
                                    <span class="title">Latest Deals</span><br>
                                    <?php
                                    $panelLatestDeals = '<div class="deals-grid">';

                                    $gridColumns = [
                                        [
                                            'attribute' => 'country.country_name',
                                            'label' => 'Country',
                                            'hAlign' => 'left',
                                            'vAlign' => 'middle',
                                        ],
                                        [
                                            'attribute' => 'contact.name',
                                            'label' => 'Publisher',
                                            'hAlign' => 'left',
                                            'vAlign' => 'middle',
                                        ],
                                        'deal_date:date',
                                    ];
                                    $panelLatestDeals .= GridView::widget([
                                                'dataProvider' => $bookDeals,
                                                'resizableColumns' => false,
                                                'summary' => "",
                                                'showPageSummary' => false,
                                                'filterRowOptions' => ['class' => 'kartik-sheet-style'],
                                                'responsive' => true,
                                                'id' => 'latest-deals-grid',
                                                'pjax' => true,
                                                'pjaxSettings' => [
                                                    'neverTimeout' => true,
                                                    'enablePushState' => false,
                                                    'id' => 'deals',
                                                ],
                                                'hover' => true,
                                                'columns' => $gridColumns,
                                    ]);
                                    $panelLatestDeals .= "</div>";

                                    echo $panelLatestDeals;
                                    ?>
                                <?php endif; ?>

                            </div>
                        </div>   
                    </div>  
                </div>
                <?php
                $moreRightsContent = "";
                if (!empty($model->usAgent->name)) {
                    $emailTo = (!empty($model->usAgent->email) ? Html::a('<i class="glyphicon glyphicon-envelope"></i>', null, ['href' => 'mailto:' . $model->usAgent->email . '?Subject=' . $emailSubjectLink, 'target' => '_blank']) : "");
                    $moreRightsContent .= '<div class="content-wrapper">';
                    $moreRightsContent .= '<div class="title">US Agent</div>';
                    $moreRightsContent .= '<div class="content">' . $model->usAgent->name . '</div>';
                    $moreRightsContent .= '<div class="content icon">' . $model->usAgent->email . $emailTo . '</div>';
                    $moreRightsContent .= '</div>';
                }
                if (!empty($model->translationAgent->name)) {
                    $emailTo = (!empty($model->translationAgent->email) ? Html::a('<i class="glyphicon glyphicon-envelope"></i>', null, ['href' => 'mailto:' . $model->translationAgent->email . '?Subject=' . $emailSubjectLink, 'target' => '_blank']) : "");
                    $moreRightsContent .= '<div class="content-wrapper">';
                    $moreRightsContent .= '<div class="title">Translation Agent</div>';
                    $moreRightsContent .= '<div class="content">' . $model->translationAgent->name . '</div>';
                    $moreRightsContent .= '<div class="content icon">' . $model->translationAgent->email . $emailTo . '</div>';
                    $moreRightsContent .= '</div>';
                }
                if (!empty($model->rights_tv_info)) {
                    $moreRightsContent .= '<div class="content-wrapper">';
                    $moreRightsContent .= '<div class="title">TV Rights Info</div>';
                    $moreRightsContent .= '<div class="content">' . $model->rights_tv_info . '</div>';
                    $moreRightsContent .= '</div>';
                }
                if (!empty($model->rights_film_info)) {
                    $moreRightsContent .= '<div class="content-wrapper">';
                    $moreRightsContent .= '<div class="title">Film Rights Info</div>';
                    $moreRightsContent .= '<div class="content">' . $model->rights_film_info . '</div>';
                    $moreRightsContent .= '</div>';
                }
                $moreRightsInformation = '';
                if (!empty($model->rights_information)) {
                    $moreRightsInformation .= '<div class="Rights Information">';
                    $moreRightsInformation .= '<div class="title">Rights Information</div>';
                    $moreRightsInformation .= '<div class="content">' . $model->rights_information . '</div>';
                    $moreRightsInformation .= '</div>';
                }
                ?>
                <?php if (!empty($moreRightsContent)): ?>                
                    <div id="more-rights" class="row">
                        <div class="col-lg-12">                
                            <?php
                            $rightsOwnerNotes = "";


                            if (!empty($model->rightsOwner->notes)) {
                                $rightsOwnerNotes .= '<div class="translation-agent">';
                                $rightsOwnerNotes .= '<div class="title">' . $model->rightsOwner->name . ' Subagents</div>';
                                $rightsOwnerNotes .= '<div class="content-subagents">' . $model->rightsOwner->notes . '</div>';
                                $rightsOwnerNotes .= '</div>';
                            }
                            $moreRightsContent = '<div class="col-lg-5"><div class="row">' . $moreRightsContent . '</div></div>';
                            $moreRightsContent .= '<div class="col-lg-7"><div class="row">' . $rightsOwnerNotes . '</div></div>';
                            $moreRightsContent .= '<div class="col-lg-12"><div class="row">' . $moreRightsInformation . '</div></div>';

                            echo Collapse::widget([
                                'encodeLabels' => false,
                                'items' => [
                                    [
                                        'label' => '<span class="glyphicon glyphicon-plus"></span>  view more rights info',
                                        'content' => $moreRightsContent,
                                        'options' => ['class' => 'more-rights'],
                                    // open its content by default
                                    //'contentOptions' => ['class' => 'in']
                                    ],
                                ]
                            ]);
                            ?>   
                        </div>
                    </div>
                <?php endif; ?>
            </div>
            <div id="recommendations" class="row">
                <div class="col-lg-6">
                    <?php if (!empty($model->recommendation->recommendation)): ?>
                        <div class="title">Recommended</div>
                        <div class="content">
                            <?= $model->recommendation->recommendation; ?> 
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($model->recommendation_note)): ?>
                        <div class="title">Why we think this...</div>
                        <div class="content">
                            <?= $model->recommendation_note ?>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($model->literary)): ?>
                        <div class="title">Literary</div>
                        <div class="content">
                            <?=
                            StarRating::widget([
                                'name' => 'literary',
                                'value' => $model->literary,
                                'pluginOptions' => [
                                    'displayOnly' => true,
                                    'size' => 'xs',
                                    'theme' => 'lls-rating'
                                ]
                            ]);
                            ?>                    
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($model->readability)): ?>                   
                        <div class="title">Readability</div>
                        <div class="content">
                            <?=
                            StarRating::widget([
                                'name' => 'readability',
                                'value' => $model->readability,
                                'pluginOptions' => [
                                    'displayOnly' => true,
                                    'size' => 'xs',
                                    'theme' => 'lls-rating'
                                ]
                            ]);
                            ?>                    
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($model->originality)): ?>                   
                        <div class="title">Originality</div>
                        <div class="content">
                            <?=
                            StarRating::widget([
                                'name' => 'originality',
                                'value' => $model->originality,
                                'pluginOptions' => [
                                    'displayOnly' => true,
                                    'size' => 'xs',
                                    'theme' => 'lls-rating'
                                ]
                            ]);
                            ?>                    
                        </div>
                    <?php endif; ?>
                </div>
                <div class="col-lg-6">
                    <?php if (!empty($model->rating)): ?>
                        <div class="title">General Rating</div>
                        <div class="content">
                            <?=
                            StarRating::widget([
                                'name' => 'rating',
                                'value' => $model->rating,
                                'pluginOptions' => [
                                    'displayOnly' => true,
                                    'size' => 'xs',
                                    'theme' => 'lls-rating'
                                ]
                            ]);
                            ?>                    
                        </div>
                    <?php endif; ?>                    
                    <?php if (!empty($model->length)): ?>                    
                        <div class="title">Length</div>
                        <div class="content">
                            <?= $model->length ?>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($model->negatives)): ?>                    
                        <div class="title">Negatives</div>
                        <div class="content">
                            <?= $model->negatives ?>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($model->vibe)): ?>
                        <div class="title">Vibe</div>
                        <div class="content">
                            <?= $model->vibe ?>
                        </div>
                    <?php endif; ?>
                    <?php if (!empty($model->filmic)): ?>
                        <div class="title">Filmic</div>
                        <div class="content">
                            <?= $model->filmic ?>
                        </div>
                    <?php endif; ?>                    
                    <?php if (!empty($model->market)): ?>                    
                        <div class="title">Market/Comparative titles</div>
                        <div class="content">
                            <?= $model->market ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            <?php if (!empty($model->ysk)) : ?>
                <div id="ysk">
                    <div class="title">Things you need to know</div>
                    <div class="content">
                        <?= $model->ysk ?>
                    </div>
                </div>
            <?php endif; ?>
            <div id="report">
                <?php if (!empty($model->reportBy)): ?>                    
                    <div class="title">Report by <?= $model->reportBy->fullname; ?></div>
                <?php endif; ?>
                <div class="content">
                    <?= $model->body ?>
                </div>
            </div>
            <?php
            if (Yii::$app->user->can("administrator")) {
                echo '<div id="internal-notes">';
                echo '<div class="title">Internal Notes</div>';
                echo '<div class="content">' . $model->notes . '</div>';
                echo '</div>';
            };
            ?>                    

        </div>
        <div class="hidden-xs hidden-sm col-md-3 no-margins-padding">
            <div id="author">
                <div id="photo">
                    <?php if ($model->author->thumbnail_path): ?>
                        <?php
                        echo \yii\helpers\Html::img(
                                Yii::$app->glide->createSignedUrl([
                                    'glide/index',
                                    'path' => $model->author->thumbnail_path,
                                    'w' => 150
                                        ], true), ['class' => 'img-circle']
                        )
                        ?>
                    <?php else: ?>
                        <img class="img-circle" src="/dist/img/generic/no-author.jpg">
                    <?php endif; ?>
                </div>
                <div id="name"><?= $model->author->name; ?></div>
                <?php if (!empty($model->country)): ?>                    
                    <div id="origin">from <?= $model->country->country_name; ?></div>
                <?php endif; ?>
                <?php if (!empty($model->origin_comment)): ?>                    
                    <div id="origin-comment"><?= $model->origin_comment; ?></div>
                <?php endif; ?>
                <div id="about">
                    <?//= OeHelpers::ipsum(1); ?>
                    <?= $model->author->bio; ?>
                    <?php //Other Books<br>by Renne Knight:   ?>
                </div>
            </div>
        </div>
    </div>


    <?php if (!empty($model->bookAttachments)): ?>
        <div class="row" id="wrap-downloads">
            <div class="col-lg-2">
                <div class="identity">
                    <h2 class="title">Downloads</h2>
                </div>
            </div>
            <div class="col-lg-10">
                <ul>
                    <?php foreach ($model->bookAttachments as $attachment): ?>
                        <li>
                            <?php
                            echo '<a class="download-attachments" href="/book/attachment-download?id=' . $attachment->id . '" data-placement="top" data-original-title="' . $attachment->name . '">';
                            echo OeHelpers::attachment_icon($attachment->type, Yii::$app->formatter->asSize($attachment->size));
                            echo '</a>';
                            ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>

    <?php endif; ?>

    <div class="row" id="wrap-comments">
        <div id="book-comments">
            <div id="comments-title">member comments about this book</div>
            <div id="members-comments">
                <?php
                echo \yii2mod\comments\widgets\Comment::widget([
                    'model' => $model,
                    'commentView' => '@frontend/views/comments/index', // path to your template
                    'relatedTo' => 'User ' . \Yii::$app->user->identity->username . ' commented on the page ' . \yii\helpers\Url::current(),
                    'maxLevel' => 2,
                    // set `pageSize` with custom sorting
                    'dataProviderConfig' => [
                        'sort' => [
                            'attributes' => ['id'],
                            'defaultOrder' => ['id' => SORT_DESC],
                        ],
                        'pagination' => [
                            'pageSize' => 10
                        ],
                    ],
                    // your own config for comments ListView, for example:
                    'listViewConfig' => [
                        'emptyText' => Yii::t('app', 'No comments found.'),
                    ]
                ]);
                ?>
            </div>
        </div>
    </div>

</div>
<?php
$type = Bookmark::TYPE_BOOK;
$author = addslashes($model->author->name);
$title = addslashes(\yii\helpers\StringHelper::truncate($model->title, 150, '...', null, true));
$js = <<<EOD
$("#toolbar-bookmark").on('click', function (event) {
    $.ajax({
        type: 'POST',
        url: '/bookmark/active?id=$model->id&type=$type&url=$model->slug&title=$title&author=$author',               
        data: $(this).serialize(), 
        success: function (data) {
        if(data.class === 'active'){
           $('#toolbar-bookmark').addClass('active');
        } else {
            $('#toolbar-bookmark').removeClass('active');            
        }
        $('#flash-message').load('/partial/message');            
        },
    })
});
$("#toolbar-favorite").on('click', function (event) {
    $.ajax({
        type: 'POST',
        url: '/favorite/active?id=$model->id',
        data: $(this).serialize(), 
        success: function (data) {
        if(data.class === 'active'){
           $('#toolbar-favorite').addClass('active');
        } else {
            $('#toolbar-favorite').removeClass('active');            
        }
        $('#flash-message').load('/partial/message');            
        },
    })
});
$('.more-rights').on('show.bs.collapse', function () {
   $('.collapse-toggle').html('<span class="glyphicon glyphicon-minus"></span> hide more rights info');     
});
$('.more-rights').on('hide.bs.collapse', function () {
   $('.collapse-toggle').html('<span class="glyphicon glyphicon-plus"></span> view more rights info');     
});    
$("#toolbar-email").on('click', function (event) {
    $.ajax({
        type: 'POST',
        url: '/communication/send-email?id=$model->id',
        data: $(this).serialize(), 
        success: function (data) {
        if(data.class === 'sent'){
           $('#toolbar-email').addClass('sent');
           $('#toolbar-email').addClass('glyphicon-send');
           $('#toolbar-email').removeClass('glyphicon-envelope');            
           $('#toolbar-email').removeClass('not-sent');            
        } else {
           $('#toolbar-email').addClass('not-sent');
           $('#toolbar-email').removeClass('sent');            
        }
        $('#flash-message').load('/partial/message');            
        },
    })
});        
EOD;

$this->registerJs($js, static::POS_END);
?>
