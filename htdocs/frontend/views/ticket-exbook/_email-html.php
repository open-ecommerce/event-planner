<?php
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


/* @var $this \yii\web\View view component instance */
/* @var $message \yii\mail\MessageInterface the message bing composed */
/* @var $content string main view render result */

//this adds model element to the View object's params.
$this->params['model'] = $model; 

?>

<?php $this->beginPage() ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <title>London Literary Scouting - BOOK REPORT</title>
    <style>
        @media only screen {
            html {
                min-height: 100%;
                background: #F6F0E2
            }
        }
        @media only screen and (max-width: 596px) {
            .small-float-center {
                margin: 0 auto!important;
                float: none!important;
                text-align: center!important
            }
        }
        @media only screen and (max-width: 596px) {
            table.body img {
                width: auto;
                height: auto
            }
            table.body center {
                min-width: 0!important
            }
            table.body .container {
                width: 95%!important
            }
            table.body .columns {
                height: auto!important;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                padding-left: 16px!important;
                padding-right: 16px!important
            }
            table.body .columns .columns {
                padding-left: 0!important;
                padding-right: 0!important
            }
            table.body .collapse .columns {
                padding-left: 0!important;
                padding-right: 0!important
            }
            th.small-6 {
                display: inline-block!important;
                width: 50%!important
            }
            th.small-12 {
                display: inline-block!important;
                width: 100%!important
            }
            .columns th.small-12 {
                display: block!important;
                width: 100%!important
            }
            table.menu {
                width: 100%!important
            }
            table.menu td,
            table.menu th {
                width: auto!important;
                display: inline-block!important
            }
            table.menu.vertical td,
            table.menu.vertical th {
                display: block!important
            }
            table.menu[align=center] {
                width: auto!important
            }
        }
    </style>
</head>


<?php $this->beginBody() ?>
<body style="-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;box-sizing:border-box;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important"><span class="preheader" style="color:#F6F0E2;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;mso-hide:all!important;opacity:0;overflow:hidden;visibility:hidden"></span>
    <table class="body" style="Margin:0;background:#F6F0E2;border-collapse:collapse;border-spacing:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%">
        <tr style="padding:0;text-align:left;vertical-align:top">
            <td class="center" align="center" valign="top" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                <center data-parsed="" style="min-width:580px;width:100%">
                    <table align="center" class="wrapper header float-center" style="Margin:0 auto;background:#F7F0E3;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%">
                        <tr style="padding:0;text-align:left;vertical-align:top">
                            <td class="wrapper-inner" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:20px;text-align:left;vertical-align:top;word-wrap:break-word">
                                <table align="center" class="container" style="Margin:0 auto;background:0 0;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:580px">
                                    <tbody>
                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                            <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                                                <table class="row collapse" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                                    <tbody>
                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                            <center data-parsed="" style="min-width:580px;width:100%"><img id="header-logo" src="http://londonliteraryscouting.com/london-literary-scouting-logo.png" align="center" class="float-center" style="-ms-interpolation-mode:bicubic;Margin:0 auto;clear:both;display:block;float:none;margin:0 auto;max-width:100%;outline:0;text-align:center;text-decoration:none;width:300px">
                                                            </center>
                                                            <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                <tbody>
                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                        <td height="25px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:25px;font-weight:400;hyphens:auto;line-height:25px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table align="center" class="container float-center" style="Margin:0 auto;background:#2E2D2E;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px">
                        <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                                <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                                    <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                        <tbody>
                                            <tr style="padding:0;text-align:left;vertical-align:top">
                                                <td height="16px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                        <tbody>
                                            <tr style="padding:0;text-align:left;vertical-align:top">
                                                <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px">
                                                    <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                            <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tbody>
                                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                                            <td height="25px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:25px;font-weight:400;hyphens:auto;line-height:25px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <h1 id="marked" class="text-center" style="Margin:0;Margin-bottom:10px;background-color:#E7FF47;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:2em;font-weight:600;line-height:1.3;margin:0 auto;margin-bottom:10px;padding:3px 7px;text-align:center;width:320px;word-wrap:normal">LLS Book Report</h1>
                                                                <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tbody>
                                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                                            <td height="25px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:25px;font-weight:400;hyphens:auto;line-height:25px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <p id="title" style="Margin:0;Margin-bottom:10px;color:#FF5C48;font-family:Helvetica,Arial,sans-serif;font-size:2em;font-weight:400;line-height:1.1em;margin:5px 0;margin-bottom:10px;padding:0;text-align:left"><?= $model->title; ?></p>
                                                                <p id="author" style="Margin:0;Margin-bottom:5px;color:#F6F0E2;font-family:Helvetica,Arial,sans-serif;font-size:1.2em;font-weight:400;line-height:1;margin:0;margin-bottom:10px;padding:0;text-align:left">by <?= $model->author->name; ?></p>
                                                                <?php if (!empty($model->country)): ?>
                                                                <p id="author" style="Margin:0;Margin-bottom:10px;color:#F6F0E2;font-family:Helvetica,Arial,sans-serif;font-size:0.9em;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left">from <?= $model->country->country_name; ?></p>
                                                                <?php endif; ?>
                                                                <p id="categories" style="Margin:0;Margin-bottom:10px;background-color:#E7FF47;color:#000;display:inline-flex;font-family:Helvetica,Arial,sans-serif;font-size:.9em;font-weight:700;line-height:1.3;margin:0;margin-bottom:10px;padding:3px 7px;text-align:left"><?= (isset($model->category->name) ? $model->category->name : false); ?></p>
                                                                <p id="categories" style="Margin:0;Margin-bottom:10px;background-color:#E7FF47;color:#000;display:inline-flex;font-family:Helvetica,Arial,sans-serif;font-size:.9em;font-weight:700;line-height:1.3;margin:0;margin-bottom:10px;padding:3px 7px;text-align:left"><?= (!empty($model->otherCategories) ?  $model->otherCategories  : false); ?></p>
                                                                <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                        <th class="callout-inner rights" style="Margin:0;background:#F6F0E2;border:none;color:#130101;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:22px 0 15px 25px;padding:20px;text-align:left;width:100%">
                                                                            <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                                                                <tbody>
                                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                        <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:0!important;padding-right:0!important;text-align:left;width:564px">
                                                                                            <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                                <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                                   <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">                                                                                                        
                                                                                                    <?php if (!empty($model->publisher->name)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Publishing House</strong>
                                                                                                            <br/><?= $model->publisher->name ?>
                                                                                                            <br/><?= $model->publisher->email ?>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->rightsOwner->name)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Rights Owner</strong>
                                                                                                            <br/><?= $model->rightsOwner->name; ?>
                                                                                                            <br/><?= $model->rightsOwner->email; ?></p>
                                                                                                    <?php endif; ?>                                                                                                       
                                                                                                    <?php if (!empty($model->rightsOwner->notes)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong><?= $model->rightsOwner->name . ' Subagents' ?></strong>
                                                                                                            <br/><?= $model->rightsOwner->notes; ?>
                                                                                                    <?php endif; ?>                                                                                                       
                                                                                                    <?php if (!empty($model->primaryAgent->name)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Primary Agent</strong>
                                                                                                            <br/><?= (isset($model->primaryAgent->name) ? $model->primaryAgent->name : false); ?>
                                                                                                            <br/><?= $model->primaryAgent->email ?></p>
                                                                                                    <?php endif; ?>                                                                                                       
                                                                                                        <p id="mydeal" style="Margin:0;Margin-bottom:10px;background-color:#E7FF47;color:#000;display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:1.2em;font-weight:400;line-height:1.3;margin:0;margin-bottom:11px;padding:5px 9px;text-align:center;width:100%"><?= $model->getUserDeal() ?></p>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Latest Deals</strong>
                                                                                                        </p>
                                                                                                    <?php
                                                                                                    $panelLatestDeals = '';
                                                                                                    $gridColumns = [
                                                                                                        [
                                                                                                            'attribute' => 'country.country_name',
                                                                                                            'label' => 'Country',
                                                                                                            'hAlign' => 'left',
                                                                                                        ],
                                                                                                        [
                                                                                                            'attribute' => 'contact.name',
                                                                                                            'label' => 'Publisher',
                                                                                                            'hAlign' => 'left',
                                                                                                        ],
                                                                                                            'deal_date:date',
                                                                                                        ];
                                                                                                    $panelLatestDeals .= GridView::widget([
                                                                                                                'dataProvider' => $bookDeals,
                                                                                                                'resizableColumns' => false,
                                                                                                                'summary' => "",
                                                                                                                'showPageSummary' => false,
                                                                                                                'responsive' => true,
                                                                                                                'id' => 'latest-deals-grid',
                                                                                                                'pjax' => false,
                                                                                                                'hover' => false,
                                                                                                                'columns' => $gridColumns,
                                                                                                    ]);

                                                                                                    echo $panelLatestDeals;
                                                                                                    ?>
                                                                                                   </th>
                                                                                                    <th class="expander" style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <hr>
                                                                            <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                <tbody>
                                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                        <td height="5px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:5px;font-weight:400;hyphens:auto;line-height:5px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                                                                <tbody>
                                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                        <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:0!important;padding-right:0!important;text-align:left;width:564px">
                                                                                            <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                                <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                                    <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                                                    <?php if (!empty($model->usAgent->name)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>US Agent</strong>
                                                                                                            <br/><?= $model->usAgent->name ?>
                                                                                                            <br/><?= $model->usAgent->email ?></p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->translationAgent->name)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Translation Agent</strong>
                                                                                                            <br/><?= $model->translationAgent->name ?>
                                                                                                            <br/><?= $model->translationAgent->email ?></p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->rights_tv_info)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>TV Rights Info</strong>
                                                                                                            <br/><?= $model->rights_tv_info ?>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->rights_film_info)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>TV Rights Info</strong>
                                                                                                            <br/><?= $model->rights_film_info ?>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->rights_information)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Rights Information</strong>
                                                                                                            <br/><?= $model->rights_information ?>
                                                                                                    <?php endif; ?>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </th>
                                                                    </tr>
                                                                </table>
                                                                <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                        <th class="callout-inner recommendation" style="Margin:0;background:#FF5C48;border:none;color:#130101;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:22px 0 15px 25px;padding:20px 25px;text-align:left;width:100%">
                                                                            <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                                                                <tbody>
                                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                        <th class="small-12 large-6 columns first" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:0!important;padding-right:0!important;text-align:left;width:50%">
                                                                                            <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                                <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                                    <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                                                    <?php if (!empty($model->recommendation->recommendation)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Recommended</strong>
                                                                                                            <br/><?= $model->recommendation->recommendation; ?>
                                                                                                            <br/>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->recommendation_note)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Why we think this...</strong>
                                                                                                            <br/><?= strip_tags($model->recommendation_note); ?>
                                                                                                            <br/>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->literary)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Literary</strong>
                                                                                                            <br/><img src="http://londonliteraryscouting.com/img/generic/stars_<?= $model->literary ?>.jpg" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto">
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->readability)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Readability</strong>
                                                                                                            <br/><img src="http://londonliteraryscouting.com/img/generic/stars_<?= $model->readability ?>.jpg" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto">
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->originality)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Originality</strong>
                                                                                                            <br/><img src="http://londonliteraryscouting.com/img/generic/stars_<?= $model->originality ?>.jpg" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto">
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                        <th class="small-12 large-6 columns last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:0!important;padding-right:0!important;text-align:left;width:50%">
                                                                                            <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                                <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                                    <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                                                    <?php if (!empty($model->rating)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>General Rating</strong>
                                                                                                            <br/><img src="http://londonliteraryscouting.com/img/generic/stars_<?= $model->rating ?>.jpg" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto">
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->length)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Length</strong>
                                                                                                            <br/><?= strip_tags($model->length, '<a>') ?>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->negatives)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Negatives</strong>
                                                                                                            <br/><?= strip_tags($model->negatives, '<a>') ?>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->vibe)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Vibe</strong>
                                                                                                            <br/><?= strip_tags($model->vibe, '<a>') ?>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->filmic)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Filmic</strong>
                                                                                                            <br/><?= strip_tags($model->filmic, '<a>') ?>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    <?php if (!empty($model->market)): ?>
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Market/Comparative titles</strong>
                                                                                                            <br/><?= strip_tags($model->market, '<a>') ?>
                                                                                                        </p>
                                                                                                    <?php endif; ?>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </th>
                                                                        <th class="expander" style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                                                                    </tr>
                                                                </table>
                                                                <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                        <th class="callout-inner report" style="Margin:0;background:#E7FF47;border:none;color:#2E2D2E;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 0 60px 25px;padding:20px 25px;text-align:left;width:100%">
                                                                            <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                                                                <tbody>
                                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                        <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:0!important;padding-right:0!important;text-align:left;width:564px">
                                                                                            <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                                <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                                    <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Things you need to know</strong>
                                                                                                            <br/><?= $model->ysk ?>
                                                                                                            <br/>
                                                                                                        </p>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </th>
                                                                    </tr>
                                                                </table>
                                                                <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                        <th class="callout-inner report" style="Margin:0;background:#E7FF47;border:none;color:#2E2D2E;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 0 60px 25px;padding:20px 25px;text-align:left;width:100%">
                                                                            <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%">
                                                                                <tbody>
                                                                                    <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                        <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:0!important;padding-right:0!important;text-align:left;width:564px">
                                                                                            <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                                                <tr style="padding:0;text-align:left;vertical-align:top">
                                                                                                    <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                                                        <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>Report by <?= (!empty($model->reportBy->fullname) ? $model->reportBy->fullname : '' ); ?></strong>
                                                                                                            <br/><?= $model->body ?>
                                                                                                            <br/>
                                                                                                        </p>
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </th>
                                                                    </tr>
                                                                </table>
                                                            </th>
                                                        </tr>
                                                    </table>
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="spacer float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%">
                        <tbody>
                            <tr style="padding:0;text-align:left;vertical-align:top">
                                <td height="50px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:50px;font-weight:400;hyphens:auto;line-height:50px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                            </tr>
                        </tbody>
                    </table>
                    <table align="center" class="wrapper footer float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;border-top:#DEC500 1px solid;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%">
                        <tr style="padding:0;text-align:left;vertical-align:top">
                            <td class="wrapper-inner" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:20px;text-align:left;vertical-align:top;word-wrap:break-word">
                                <table align="center" class="container" style="Margin:0 auto;background:0 0;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:580px">
                                    <tbody>
                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                            <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                                                <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:16px;padding-right:16px;text-align:left;width:564px">
                                                    <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                            <th style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                                <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:1em;font-weight:400;line-height:1.3em;margin:0;margin-bottom:10px;padding:0;text-align:left">London Literary Scouting - MacLehose, Servadio & Pupo-Thompson</p>
                                                                <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:1em;font-weight:400;line-height:1.3em;margin:0;margin-bottom:10px;padding:0;text-align:left">Second Home - 68 Hanbury Street - London E15JL</p>
                                                                <table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                                    <tbody>
                                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                                            <td height="10px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:400;hyphens:auto;line-height:10px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:1em;font-weight:400;line-height:1.3em;margin:0;margin-bottom:10px;padding:0;text-align:left">rebecca@londonliteraryscouting.com</p>
                                                                <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:1em;font-weight:400;line-height:1.3em;margin:0;margin-bottom:10px;padding:0;text-align:left">+44 78 7624 6335</p>
                                                            </th>
                                                            <th class="expander" style="Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
                                                        </tr>
                                                    </table>
                                                </th>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </center>
            </td>
        </tr>
    </table>
    <!-- prevent Gmail on iOS font size manipulation -->
    <div style="display:none;white-space:nowrap;font:15px courier;line-height:0">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>


<?php $this->endBody() ?>
</body>
    
<?php $this->endPage() ?>
</html>