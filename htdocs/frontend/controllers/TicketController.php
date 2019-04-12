<?php

namespace frontend\controllers;

use common\models\TotalTickets;
use Yii;
use common\models\Ticket;
use frontend\models\search\TicketSearch;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use trntv\filekit\actions\DeleteAction;
use trntv\filekit\actions\UploadAction;
use Intervention\Image\ImageManagerStatic;
use common\models\TicketType;
use yii\helpers\Json;
use common\models\TicketDates;
use common\models\TicketAttendance;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;

/**
 * TicketController implements the CRUD actions for Ticket model.
 */
class TicketController extends Controller
{

    /**
     * @return array
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['post'],
                ],
            ],
        ];
    }

    /**
     * Lists all Ticket models.
     * @return mixed
     */
    public function actionIndex()
    {

        $requestBarcode = Yii::$app->request->queryParams;
        $isBarcode = arrayHelper::getvalue($requestBarcode, 'TicketSearch.barcodeSearch');


        $searchModel = new TicketSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);
        $this->layout = 'main_full_width';

        // validate if there is a editable input saved via AJAX
        if (Yii::$app->request->post('hasEditable')) {
            $ticketId = Yii::$app->request->post('editableKey');
            $model = Ticket::findOne($ticketId);
            $out = Json::encode(['output' => '', 'message' => '']);
            $posted = current($_POST['Ticket']);
            $post = ['Ticket' => $posted];
            if ($model->load($post)) {
                // can save model or do something before saving model
                $model->save();
                $output = '';
                $out = Json::encode(['output' => $output, 'message' => '']);
            }
            echo $out;
            return;
        }

        //add new record if scanning and found
        if ((!empty($isBarcode)) && ($dataProvider->getTotalCount() == 1)) {
            $newQuery = clone $dataProvider->query;
            $currentTicket = $newQuery->limit(1)->one();
            $attendance = new TicketAttendance();
            $attendance->ticket_id = $currentTicket->id;
            $attendance->venue_id = 1;
            $attendance->attendance = date("Y-m-d H:i:s");
            $attendance->direction = 1;
            $attendance->save(false);
        }

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }


    /**
     * Lists all Ticket models.
     * @return mixed
     */
    public function actionExiting()
    {

        $requestBarcode = Yii::$app->request->queryParams;
        $isBarcode = arrayHelper::getvalue($requestBarcode, 'TicketSearch.barcodeSearch');


        $searchModel = new TicketSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);
        $this->layout = 'main_full_width';

        // validate if there is a editable input saved via AJAX
        if (Yii::$app->request->post('hasEditable')) {
            $ticketId = Yii::$app->request->post('editableKey');
            $model = Ticket::findOne($ticketId);
            $out = Json::encode(['output' => '', 'message' => '']);
            $posted = current($_POST['Ticket']);
            $post = ['Ticket' => $posted];
            if ($model->load($post)) {
                // can save model or do something before saving model
                $model->save();
                $output = '';
                $out = Json::encode(['output' => $output, 'message' => '']);
            }
            echo $out;
            return;
        }

        //add new record if scanning and found
        if ((!empty($isBarcode)) && ($dataProvider->getTotalCount() == 1)) {
            $newQuery = clone $dataProvider->query;
            $currentTicket = $newQuery->limit(1)->one();
            $attendance = new TicketAttendance();
            $attendance->ticket_id = $currentTicket->id;
            $attendance->venue_id = 1;
            $attendance->attendance = date("Y-m-d H:i:s");
            $attendance->direction = 0;
            $attendance->save(false);
        }

        return $this->render('exiting', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }


    /**
     * Displays a single Ticket model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view-quick', [
            'model' => $this->findModel($id),
        ]);
    }


    public function actionTotalTickets()
    {
        $model = TotalTickets::find()->all();
        $dataProvider = new ActiveDataProvider([
            'query' => $model
        ]);

        return $this->render('total-tickets', [
            'dataProvider' => $dataProvider,
        ]);
    }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    /**
     * Creates a new Ticket model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Ticket();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['index']);
        } else {
            return $this->render('create', [
                'model' => $model,
                'ticketType' => TicketType::find()->all(),
            ]);
        }
    }

    /**
     * Updates an existing Ticket model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['index']);
        } else {
            return $this->render('update', [
                'model' => $model,
                'ticketType' => TicketType::find()->all(),
            ]);
        }
    }

    /**
     * Deletes an existing Ticket model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Ticket model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Ticket the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Ticket::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    public function actionTypes($query)
    {
        $models = \common\models\base\TicketType::findAllByName($query);
        $items = [];

        foreach ($models as $model) {
            $items[] = ['id' => $model->id, 'ticket_name' => $model->ticket_name];
        }

        Yii::$app->response->format = \Yii::$app->response->format = 'json';

        return $items;
    }

    public function actionDetail()
    {
        if (isset($_POST['expandRowKey'])) {
            $ID = Yii::$app->request->post('expandRowKey');
            $model = TicketAttendance::find()->where(['ticket_id' => $ID])->orderBy('attendance desc');

            $dataProvider = new ActiveDataProvider([
                'query' => $model,
                'pagination' => ['pageSize' => 20,],
            ]);
            $this->layout = '_only-content';
            return $this->render('_grid_attendance-details', [
                'dataProvider' => $dataProvider,
            ]);
        } else {
            return '<div class="alert alert-danger">No data found with id:' . $ID . '</div>';
        }
    }

}
