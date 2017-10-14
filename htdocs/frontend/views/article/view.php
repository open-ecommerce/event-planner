<?php
use yii\web\JsExpression;
use yii\helpers\Html;
use yeesoft\comments\widgets\Comments;
use common\helpers\OeHelpers;
use common\models\Bookmark;


/* @var $this yii\web\View */
/* @var $model common\models\Article */
$this->title = $model->title;
$this->params['breadcrumbs'][] = ['label' => Yii::t('frontend', 'Articles'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div id="flash-message"></div>

<div id="article-item" class="col-lg-12">

    <?php
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '#',
        'id' => 'toolbar-bookmark',
        'alt' => 'Bookmark this book',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-bookmark' . $model->bookmarked];
    if (Yii::$app->user->can("administrator")) {
        $url = Yii::$app->urlManager->createUrl(array('/admin/article/update?id=' . $model->id));
        $this->params['toptoolbar'][] = [
            'label' => '',
            'id' => 'toolbar-edit',
            'url' => $url,
            'alt' => 'Edit in backend',
            'target' => '_blank',
            'class' => 'btn btn-md btn-success glyphicon glyphicon-pencil'];
    };
    ?>    
    
        <?php
//        if (Yii::$app->user->can("administrator")) {
//            $urlPost = Yii::$app->urlManager->createUrl(array('/admin/article/update?id=' . $model->id));
//            echo '<a id="toolbar-edit" class="btn btn-md btn-success glyphicon glyphicon-pencil" href="' . $urlPost . '" alt="Edit in backend" target="_blank" title="Edit in backend"></a>';
//        }
        ?>

    <article class="col-lg-12" data-key="<?= $model['id'] ?>">
        <h1><?php echo $model->title ?></h1>

        <div class="meta-info">
            <span class="author">by <?= $model->author->fullname; ?></span> - <span class="posted"><?= Yii::$app->formatter->asDate($model->updated_at, 'dd MMM yyyy'); ?></span>   
        </div>
        <div class="illustration">
            <?php
            $thumbnail = '';
            $newsImagePath = (empty($model->thumbnail_path) ? $model->category->thumbnail_path : $model->thumbnail_path);
            if ($newsImagePath) {
                $thumbnail .= '<figure>';
                $thumbnail .= \yii\helpers\Html::img(
                                Yii::$app->glide->createSignedUrl([
                                    'glide/index',
                                    'path' => $newsImagePath,
                                    'w' => '100%'
                                        ], true), ['class' => 'article-image']
                );
                $thumbnail .= '</figure>';
            };
            echo $thumbnail;
            ?>

        </div>
        <div id="body">

            <div class="row">
                <?php echo $model->body ?>
            </div>
            <?php if (!empty($model->articleAttachments)): ?>
                <h3><?php echo Yii::t('frontend', 'Attachments') ?></h3>
                <ul id="article-attachments">
                    <?php foreach ($model->articleAttachments as $attachment): ?>
                        <li>
                            <?php
                            echo \yii\helpers\Html::a(
                                    $attachment->name, ['attachment-download', 'id' => $attachment->id])
                            ?>
                            (<?php echo Yii::$app->formatter->asSize($attachment->size) ?>)
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
    </article>
</div>
<?php
$type = Bookmark::TYPE_NEWS;
$author = addslashes($model->author->fullname);
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
EOD;

$this->registerJs($js, static::POS_END);
?>
