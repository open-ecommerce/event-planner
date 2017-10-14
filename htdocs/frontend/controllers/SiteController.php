<?php

namespace frontend\controllers;

use common\models\Article;
use common\models\Ticket;
use Yii;
use frontend\models\ContactForm;
use yii\web\Controller;

/**
 * Site controller
 */
class SiteController extends Controller {

    /**
     * @inheritdoc
     */
    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction'
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null
            ],
            'set-locale' => [
                'class' => 'common\actions\SetLocaleAction',
                'locales' => array_keys(Yii::$app->params['availableLocales'])
            ]
        ];
    }

    public function actionIndex() {
        
         if(Yii::$app->getUser()->isGuest) {
             $this->layout = 'main_guest'; 
            return $this->render('index');
         }
         {
            // $hotBook = Book::getCarouselLatest();
            // return $this->render('dashboard', ['latestBooks' => $hotBook]);
             $this->redirect(\Yii::$app->urlManager->createUrl("ticket/index"));
         }
        
    }

    public function actionAbout() {
        return $this->render('about');
    }

    public function actionAboutGuest() {
        $this->layout = 'main_guest'; 
        return $this->render('about-guest');
    }

    public function actionBook() {
        return $this->render('book');
    }

    public function actionContact() {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post())) {
            if ($model->contact(Yii::$app->params['adminEmail'])) {
                Yii::$app->getSession()->setFlash('alert', [
                    'body' => Yii::t('frontend', 'Thank you for contacting us. We will respond to you as soon as possible.'),
                    'options' => ['class' => 'alert-success']
                ]);
                return $this->refresh();
            } else {
                Yii::$app->getSession()->setFlash('alert', [
                    'body' => \Yii::t('frontend', 'There was an error sending email.'),
                    'options' => ['class' => 'alert-danger']
                ]);
            }
        }
        return $this->render('contact', [
                    'model' => $model
        ]);
    }

}
