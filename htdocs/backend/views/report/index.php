<?php
use dosamigos\chartjs\ChartJs;
use common\grid\EnumColumn;
use common\models\BookViews;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\search\ArticleSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('backend', 'Books Viewed');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="reports-index">

<div class="row">

    <?php
//        $books = new BookViews;
//        $BooksByMonth = $books->messagesByMonth;
//
//        foreach ($messagesByMonth as $item) {
//            $monthValues[] = $item['month'];
//            $monthTotals[] = $item['total'];
//        }
    ?>
                
      <?= ChartJs::widget([
          'type' => 'line',
          'options' => [
              'height' => 150,
              'width' => 400
          ],
          'data' => [
              'labels' => ["June", "July", "August"],
              'datasets' => [
                  [
                    'label' => "Books Views",
                    'fill' =>  TRUE,
                    'lineTension' =>  0.1,
                    'backgroundColor' =>  "rgba(75,192,192,0.4)",
                    'borderColor' =>  "rgba(75,192,192,1)",
                    'borderCapStyle' =>  'butt',
                    'borderDash' =>  [],
                    'borderDashOffset' =>  0.0,
                    'borderJoinStyle' =>  'miter',
                    'pointBorderColor' =>  "rgba(75,192,192,1)",
                    'pointBackgroundColor' =>  "#fff",
                    'pointBorderWidth' =>  1,
                    'pointHoverRadius' =>  5,
                    'pointHoverBackgroundColor' =>  "rgba(75,192,192,1)",
                    'pointHoverBorderColor' =>  "rgba(220,220,220,1)",
                    'pointHoverBorderWidth' =>  2,
                    'pointRadius' =>  1,
                    'pointHitRadius' =>  10,
                    'data' => [0,10,20]
                  ]
              ]
          ]
      ]);
      ?>


</div>

</div>