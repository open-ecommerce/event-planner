<?php

namespace common\models;

use Yii;
use yii\base\Model;

/**
 * ContactForm is the model behind the contact form.
 */
class Email extends Model {

    public $name;
    public $email;
    public $subject;
    public $body;

    /**
     * @return array the validation rules.
     */
    public function rules() {
        return [
            // name, email, subject and body are required
            [['name', 'email', 'subject', 'body'], 'required'],
            // We need to sanitize them
            [['name', 'subject', 'body'], 'filter', 'filter' => 'strip_tags'],
            // email has to be a valid email address
            ['email', 'email'],
        ];
    }

    /**
     * @return array customized attribute labels
     */
    public function attributeLabels() {
        return [
            'name' => Yii::t('frontend', 'Name'),
            'email' => Yii::t('frontend', 'Email'),
            'subject' => Yii::t('frontend', 'Subject'),
            'body' => Yii::t('frontend', 'Body'),
        ];
    }

    /**
     * Sends an email to the specified email address using the information collected by this model.
     * @param  string  $email the target email address
     * @return boolean whether the model passes validation
     */
    public function emailContact($email, $model, $modelDeals) {
        if ($this->validate()) {
            $params = array(
               'model' => $model,
               'bookDeals' => $modelDeals,                
            );           
            return Yii::$app->mailer->compose(
                                    [
                                        'html' => '/book/_email-html',
                                        'text' => '/book/_email-text',
                            ], $params)
                            ->setTo($email)
                            ->setFrom(Yii::$app->params['robotEmail'])
                            ->setReplyTo([$this->email => $this->name])
                            ->setSubject($this->subject)
//                            ->setTextBody($this->body)
                            ->setTextBody("viva peron")
                            ->send();
        } else {
            return false;
        }
    }

    public function emailNewsletter($email, $model) {
        if ($this->validate()) {
            $params = array(
               "model" => $model
            );
            
            return Yii::$app->mailer->compose(
                                    [
                                        'html' => '/book/_email-html',
                                        'text' => '/book/_email-text',
                            ], $params)
                            ->setTo($email)
                            ->setFrom(Yii::$app->params['robotEmail'])
                            ->setReplyTo([$this->email => $this->name])
                            ->setSubject($this->subject)
                            ->setTextBody($this->body)
                            ->send();
        } else {
            return false;
        }
    }

    public function emailCustom($email, $model) {
        if ($this->validate()) {
            $params = array(
               "model" => $model
            );
            return Yii::$app->mailer->compose(
                                    [
                                        'html' => '/book/_email-custom-html',
                                        'text' => '/book/_email-custom-text',
                            ], $params)
                            ->setTo($email)
                            ->setFrom(Yii::$app->params['robotEmail'])
                            ->setReplyTo([$this->email => $this->name])
                            ->setSubject($this->subject)
                            ->setTextBody($this->body)
                            ->setHtmlBody($this->body)
                            ->send();
        } else {
            return false;
        }
    }    
    
}
